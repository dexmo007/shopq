<template>
  <div v-if="admittance">
    <h3>Einlass</h3>
    <div>
      <div class="row-center">
        <button
          :class="{filled: capacityLimitReached}"
          @click="handleChange(1)"
        >
          Kommt
          <span v-if="capacityLimitReached">(Laden voll!)</span>
        </button>

        <button
          @click="admitExchange"
          :disabled="admittance.count === 0"
        >
          Tausch
        </button>

        <button
          @click="handleChange(-1)"
          :disabled="admittance.count === 0"
        >Geht</button>
      </div>
      <div class="row-center">
        <span>Im Laden: {{admittance.count}}</span>
      </div>
      <section>
        <h3>Warteschlange</h3>
        <div>
          <span>{{peopleInQueue}} Personen in der Warteschlange</span>
        </div>
        <div>
          <button @click="addAnonToQueue">
            Person zu Warteschlange hinzufügen
          </button>
        </div>
      </section>
      <section>
        <h3>Log</h3>
        <ul>
          <li
            v-for="event in events"
            :key="event.id"
          >
            {{event.relativeTime}}: {{event.typeText}}
          </li>
        </ul>
      </section>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import firebase from "firebase/app";
import { selectUnit } from "@formatjs/intl-utils";

const db = firebase.firestore();

const eventTypesI18n = {
  ENTER: "Kommt",
  LEAVE: "Geht"
};

export default {
  name: "MarketAdmittance",
  props: ["id"],
  data() {
    return {
      admittance: null,
      shop: null,
      defaultShopParams: null,
      queue: null,
      eventData: [],
      rtf: new Intl.RelativeTimeFormat("de", { numeric: "auto" })
    };
  },
  async mounted() {
    // shop info
    this.defaultShopParams = await this.$bind(
      "defaultShopParams",
      db.collection("shops").doc("default")
    );
    this.shop = await this.$bind("shop", db.collection("shop").doc(this.id));
    // admittance control
    const a = await this.$bind(
      "admittance",
      db.collection("admittances").doc(this.id)
    );
    if (!a) {
      db.collection("admittances")
        .doc(this.id)
        .set({
          count: 0
        });
    }
    // queue
    this.$bind("queue", db.collection("queues").doc(this.id));
    // events
    this.$bind(
      "eventData",
      db
        .collection("admittanceEvents")
        .where("shopId", "==", this.id)
        .orderBy("timestamp", "desc")
        .limit(20)
    );
  },
  computed: {
    shopParams() {
      return {
        ...this.defaultShopParams,
        ...this.shop
      };
    },
    capacityLimitReached() {
      return this.admittance.count >= this.shopParams.capacity;
    },
    peopleInQueue() {
      if (!this.queue || !this.queue.users) {
        return 0;
      }
      return this.queue.users.length;
    },
    events() {
      return this.eventData.map(({ type, timestamp }) => ({
        type,
        typeText: eventTypesI18n[type],
        timestamp: timestamp.toDate(),
        relativeTime: this.formatTimeRelatively(timestamp)
      }));
    }
  },
  methods: {
    formatTimeRelatively(ts) {
      const { value, unit } = selectUnit(ts.toDate(), Date.now());
      return this.rtf.format(value, unit);
    },
    resolveType(type) {
      if (typeof type === "number") {
        if (type === 1) {
          return "ENTER";
        } else if (type === -1) {
          return "LEAVE";
        }
        throw new Error("unknown type: " + type);
      }
      return type;
    },
    createEvent(type) {
      return {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        shopId: this.id,
        type: this.resolveType(type)
      };
    },
    async handleChange(c) {
      const batch = db.batch();
      const admittanceRef = db.collection("admittances").doc(this.id);
      batch.set(
        admittanceRef,
        {
          count: firebase.firestore.FieldValue.increment(c)
        },
        { merge: true }
      );
      const eventRef = db.collection("admittanceEvents").doc();
      batch.set(eventRef, this.createEvent(c));
      await batch.commit();
    },
    async admitExchange() {
      const batch = db.batch();
      const eventsRef = db.collection("admittanceEvents");
      const enterEvent = eventsRef.doc();
      batch.set(enterEvent, this.createEvent("ENTER"));
      const leaveEvent = eventsRef.doc();
      batch.set(leaveEvent, this.createEvent("LEAVE"));
      await batch.commit();
    },
    async addAnonToQueue() {
      db.collection("queues")
        .doc(this.id)
        .set(
          {
            users: firebase.firestore.FieldValue.arrayUnion({
              uid: db
                .collection("queues")
                .doc(this.id)
                .collection("users")
                .doc().id,
              type: "ANON"
            })
          },
          { merge: true }
        );
    }
  }
};
</script>

<style scoped>
.row-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.filled {
  background-color: darkorange;
}
</style>
