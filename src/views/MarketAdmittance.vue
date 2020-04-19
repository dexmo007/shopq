<template>
  <div
    v-if="admittance"
    id="einlass"
  >
    <router-link
      to="./control"
      tag="h1"
    >{{!shop || !shop.placeDetails ? 'Name lädt...' : shop.placeDetails.name}}</router-link>
    <section>
      <div id="store-quota">
        <progress-bar
          :threshold="shopParams.capacity"
          :count="admittance.count"
        />
        <span>{{admittance.count}} von max. {{shopParams.capacity}} Kunden im Geschäft</span>
      </div>
      <button
        id="market-leave"
        @click="onLeave"
        class="danger"
        :disabled="admittance.count === 0"
      >
        Kunde verlässt Laden
      </button>
    </section>
    <section v-if="capacityLimitReached">
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
      <div
        v-if="lastAnonQueueEntry && peopleInQueue > 0"
        class="row-center"
        id="lastWord"
      >
        <b>{{lastAnonQueueEntry}}</b><br/>
        <span>Zuletzt zugewiesenes Ticket-Wort</span>
      </div>
    </section>

    <section>
      <h3> {{capacityLimitReached ? 'nächster Kunde' : 'Einlass'}}</h3>
      <div
        id="next-admittance"
        v-if="nextAdmittance !== undefined"
      >
        <div
          v-if="nextAdmittance.ticketCode && nextAdmittance.type !== 'ANON'"
          id="qrscan-container"
        >
          <span v-if="scanning">QR Code scannen:</span>
          <div>
            <button
              :class="{danger: scanning}"
              @click="scanning = !scanning"
            >{{scanning ? 'Stop' : 'QR-Code scannen'}}</button></div>
          <QRCodeScanner
            v-if="scanning"
            @decode="onDecode"
          />
          <span>Ticket-Nr.: {{nextAdmittance.ticketCode}}</span>
        </div>
        <div v-else>
            <span>Ticket-Wort:  {{nextAdmittance.ticketCode}} </span>
        </div>

        <div id="next-admittance-interaction">
          <button
            class="success"
            @click="admitNext"
          >Kunde Einlassen</button>
          <button @click="dismissNextAdmittance">Nicht erschienen</button>
        </div>
      </div>
      <button
        id="market-enter"
        class="success"
        @click="handleChange(1)"
      >
        Kommt
        <span v-if="capacityLimitReached">(Laden voll!)</span>
      </button>
    </section>
    <section>
      <information-box
        title="Log"
        v-if="events.length"
      >
        <ul id="log-box">
          <li
            v-for="event in events"
            :key="event.id"
          >
            {{event.relativeTime}}: {{event.typeText}}
          </li>
        </ul>
      </information-box>
    </section>
  </div>
  <div
    v-else
    class="loading"
  >
    Loading...
  </div>
</template>

<script>
import firebase from "firebase/app";
import { selectUnit } from "@formatjs/intl-utils";
import { getRandomDocument } from "@/util/firebase-rng";
import InformationBox from "@/components/InformationBox";
import QRCodeScanner from "@/components/QRCodeScanner.vue";
import ProgressBar from "@/components/ProgressBar.vue";

const db = firebase.firestore();

const eventTypesI18n = {
  ENTER: "Kommt",
  LEAVE: "Geht"
};

export default {
  name: "MarketAdmittance",
  props: ["id"],
  components: { QRCodeScanner, ProgressBar, InformationBox },
  data() {
    return {
      admittance: null,
      shop: null,
      placeDetails: null,
      defaultShopParams: null,
      queue: [],
      eventData: [],
      rtf: new Intl.RelativeTimeFormat("de", { numeric: "auto" }),
      scanning: false,
      lastAnonQueueEntry: null
    };
  },
  async mounted() {
    // shop info
    this.defaultShopParams = await this.$bind(
      "defaultShopParams",
      db.collection("shops").doc("default")
    );
    //this.placeDetails = await getPlaceDetails(this.id);
    this.shop = await this.$bind("shop", db.collection("shops").doc(this.id));
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
        .orderBy("joinedAt", "asc")
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
      return this.admittance.count >= Number(this.shopParams.capacity);
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
    createEvent(type, admittanceEventData) {
      return {
        ...(admittanceEventData || {}),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        shopId: this.id,
        type: this.resolveType(type)
      };
    },
    async handleChange(c, admittanceEventData) {
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
      batch.set(eventRef, this.createEvent(c, admittanceEventData));
      await batch.commit();
    },
    async onLeave() {
      await this.handleChange(-1);
    },
    async addAnonToQueue() {
      const randomWord = (
        await getRandomDocument(
          firebase
            .firestore()
            .collection("randomWords")
            .doc("de")
            .collection("vegetables")
        )
      ).data().word;
      await db
        .collection("queues")
        .doc(this.id)
        .collection("users")
        .doc(`${Date.now()}-${db.collection("tmpId").doc().id}`)
        .set({
          uid: db
            .collection("queues")
            .doc(this.id)
            .collection("users")
            .doc().id,
          type: "ANON",
          joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
          ticketCode: randomWord
        });

      this.lastAnonQueueEntry = randomWord;
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
      if (
        this.nextAdmittance.ticketCode &&
        this.nextAdmittance.type !== "ANON"
      ) {
        await this.handleChange(1, {
          type: "TICKET",
          ticketCode: this.nextAdmittance.ticketCode,
          ticketId: this.nextAdmittance.ticketId
        });
        await db.collection("ticketAdmission").add({
          shopId: this.id,
          uid: this.nextAdmittance.uid,
          ticketCode: this.nextAdmittance.ticketCode,
          ticketId: this.nextAdmittance.ticketId,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        await this.handleChange(1);
      }
      await this.removeFromQueue(this.nextAdmittance.uid);
    },
    async onDecode(decoded) {
      if (!decoded) {
        return;
      }
      if (decoded === this.nextAdmittance.ticketCode) {
        await this.admitNext();
      } else {
        this.$toasted.show("Falsches Ticket!", {
          icon: "times-circle",
          duration: 2000
        });
      }
    },
    async dismissNextAdmittance() {
      await this.removeFromQueue(this.nextAdmittance.uid);
    }
  }
};
</script>

<style scoped>
#market-enter,
#market-leave {
  margin: 12px auto;
}
section {
  margin: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

#addToQ-btn {
  background-color: #f8ac59;
  max-width: 480px;
  margin: 4px auto;
}
#next-admittance {
  border: 1px solid #f8ac59;
  border-radius: 3px;
  padding: 0.6em 1em;
}
#lastWord{
  margin-top: 16px;
}
#lastWord > b{
  background: #373737;
  color: #f8ac59;
  padding: 0.4em 0.8em;
  border-radius: 0.2em;
  display: inline-block;
}
#next-admittance-interaction {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}
#qrscan-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#qrscan-container span {
  margin: 0.5em 0;
}
</style>
