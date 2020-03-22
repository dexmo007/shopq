<template>
  <div v-if="admittance">
    <section>
      <h3>Einlass</h3>
      <div
        id="primary-interaction"
        class="row-center"
      >
        <button
          class="success"
          :class="{filled: capacityLimitReached}"
          @click="handleChange(1)"
        >
          Kommt
          <span v-if="capacityLimitReached">(Laden voll!)</span>
        </button>

        <button
          @click="onLeave"
          class="danger"
          :disabled="admittance.count === 0"
        >Geht</button>
      </div>
      <span>Im Laden: {{admittance.count}}</span>
    </section>
    <section
      v-if="nextAdmittance"
      id="next-admittance"
    >
      <template v-if="nextAdmittance.ticketCode">
        <div class="col">
          <span>QR Code scannen:</span>
          <!-- <video
              autoplay
              ref="qrscan"
            ></video> -->
          <QRCodeScanner />
        </div>
        <div class="center-row">
          <button @click="admitNext">Einlassen</button>
          <button @click="dismissNextAdmittance">Nicht erschienen</button>
        </div>
      </template>
      <template v-else>
        <div>
          Ohne Ticket
        </div>
        <div>
          <button @click="admitNext">Einlassen</button>
          <button @click="dismissNextAdmittance">Nicht erschienen</button>
        </div>
      </template>
    </section>
    <section>
      <h3>Warteschlange</h3>
      <div>
        <span>{{peopleInQueue}} Personen in der Warteschlange</span>
      </div>
      <div class="row-center">
        <button
          @click="addAnonToQueue"
          id="addToQ-btn"
        >
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
  <div v-else>
    Loading...
  </div>
</template>

<script>
import firebase from "firebase/app";
import { selectUnit } from "@formatjs/intl-utils";
import QRCodeScanner from "@/components/QRCodeScanner.vue";

const db = firebase.firestore();

const eventTypesI18n = {
  ENTER: "Kommt",
  LEAVE: "Geht"
};

export default {
  name: "MarketAdmittance",
  props: ["id"],
  components: { QRCodeScanner },
  data() {
    return {
      admittance: null,
      shop: null,
      defaultShopParams: null,
      queue: [],
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
    this.$bind(
      "queue",
      db
        .collection("queues")
        .doc(this.id)
        .collection("users")
    );
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
      return this.queue.length;
    },
    events() {
      return this.eventData.map(({ type, timestamp }) => {
        if (!timestamp) {
          timestamp = firebase.firestore.Timestamp.now();
        }
        return {
          type,
          typeText: eventTypesI18n[type],
          timestamp: timestamp.toDate(),
          relativeTime: this.formatTimeRelatively(timestamp)
        };
      });
    },
    nextAdmittance() {
      return this.queue[0];
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
    async onLeave() {
      await this.handleChange(-1);
      // if (this.queue.length) {
      //   const user = this.queue[0];
      //   this.nextAdmittance = {
      //     type: "FROM_QUEUE",
      //     user
      //   };
      //   if (user.ticketCode) {
      //     // const constraints = {
      //     //   video: true
      //     // };
      //     // navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      //     //   this.$refs.qrscan.srcObject = stream;
      //     // });
      //   }
      // }
    },
    async addAnonToQueue() {
      db.collection("queues")
        .doc(this.id)
        .collection("users")
        .add({
          uid: db
            .collection("queues")
            .doc(this.id)
            .collection("users")
            .doc().id,
          type: "ANON"
        });
    },
    async removeFromQueue(uid) {
      const snap = await db
        .collection("queues")
        .doc(this.id)
        .collection("users")
        .where("uid", "==", uid)
        .get();
      snap.forEach(doc => {
        doc.ref.delete();
      });
    },
    async admitNext() {
      await this.handleChange(1);
      await this.removeFromQueue(this.nextAdmittance.uid);
    },
    async dismissNextAdmittance() {
      await this.removeFromQueue(this.nextAdmittance.uid);
    }
  }
};
</script>

<style scoped>
section {
  margin: 21px auto;
  max-width: 480px;
  padding-bottom: 21px;
}
.row-center {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
#primary-interaction {
  margin: 15px 0;
}
#primary-interaction > button {
  max-width: 180px;
  max-height: 180px;
  width: 40vw;
  height: 25vh;
  font-size: 2em;
  font-weight: bold;
}
.filled {
  background-color: rgb(230, 230, 230);
}
#addToQ-btn {
  background-color: #f8ac59;
  max-width: 480px;
  margin: 4px auto;
}
#next-admittance {
  border: 1px solid darkgray;
  border-radius: 3px;
  padding: 1em;
}
.col {
  display: flex;
  flex-direction: column;
}
.center-row {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
