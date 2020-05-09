<template>
  <div v-if="loading">
    Loading...
  </div>
  <div
    id="market"
    v-else
  >
    <div v-if="stage === 'not-found'">
      Der Markt <i>{{id}}</i> konnte nicht gefunden werden.
      <router-link
        to="/"
        tag="button"
        class="success"
      >Zurück zur Startseite</router-link>
    </div>
    <div
      id="market-header"
      v-else
    >
      <router-link
        to="./control"
        tag="h1"
      >{{!placeDetails ? 'Name lädt...' : placeDetails.name}}</router-link>
      <span>
        <font-awesome-icon icon="map-marked-alt" />
        {{!placeDetails ? 'Addresse lädt...' : placeDetails.vicinity}}
      </span>
      <span v-if="latestActivity">Letzte Aktivität: {{latestActivity}}</span>
    </div>
    <div id="market-body">
      <div v-if="stage === 'no-support'">
        <h2 class="text-danger">Dieser Laden benutzt die App nicht</h2>
        <span>Gehen Sie so hin und versuchen Ihr Glück!</span>
        <information-box
          title="Ist das Ihr Geschäft?"
          style="margin-top: 14px;"
        >
          <div style="margin: 12px;">
            <span v-if="isUserAnonymous">
              <router-link :to="'/login?strict=true&redirect='
            + encodeURIComponent($router.currentRoute.fullPath)">Erstellen Sie ein Konto</router-link> und
            </span>
            <b>Nutzen Sie die Vorteile von shopQ!</b>
            <ul>
              <li>kostenlos</li>
              <li>einfache Bedienung</li>
              <li>minimieren Sie die Warteschlange vor ihrem Laden!</li>
            </ul>
            <router-link
              :to="`/markt/${id}/claim`"
              tag="button"
              class="success"
            >Geschäft bestätigen</router-link>
          </div>
        </information-box>
      </div>
      <div v-if="stage === 'default'">
        <div v-if="freeSlots > 0">
          <h2>Es gibt keine Schlange!</h2>
          <span>Sie können zur Zeit ohne anzustehen einkaufen gehen,</span><br>
          <span>es {{freeSlots === 1 ? 'ist ein Platz' : `sind ${freeSlots} Plätze`}} frei!</span>
        </div>
        <div
          v-else
          class="primary-interaction"
        >
          <button
            class="success"
            id="joinQ-btn"
            @click="joinQ()"
          >virtuell anstellen</button>
          <span v-if="queue.length === 0">Sei der erste in der Schlange!</span>
          <span v-else><b>{{queue.length}}</b> Personen in der Schlange</span>
        </div>
      </div>

      <div
        v-if="stage === 'q-finished'"
        id="you-made-it"
      >
        <span id="store">Viel Spaß</span><br>
        <span>beim 🛒!</span>
        <count-down
          v-if="shop.maxShoppingTime"
          @end-timer="inStore = false"
          :end-date="shoppingTimeEnd"
        />
        <button @click="setAdmissionInactive">Nicht mehr da.</button>
      </div>
      <div
        class="primary-interaction"
        v-if="stage === 'waiting-in-q'"
      >
        <span>Sie sind der <b>{{positionInQ+1}}.</b> in der Schlange.</span>
        <div
          id="ticket"
          :class="{active: positionInQ === 0}"
          v-if="queueSlot"
        >
          <span id="ticket-header">Dein Ticket:</span>
          <QRCode
            height="420px"
            width="420px"
            id="ticket-code"
            :text="queueSlot.ticketCode"
          />
          <div id="ticket-word">{{queueSlot.ticketCode}}</div>
        </div>
        <Queue
            :q-list="this.queue"
            :highlight-word="{word: queueSlot.ticketCode, ts: 'vor 4 Sekunden'}"
        />
        <button
          id="quitQ-btn"
          @click="quitQ()"
        >Schlange verlassen</button>
      </div>

      <div
        id="shopq-info"
        v-if="shopParams && shopParams.additionalInfo"
      >
        <h5>Zusatzinfo für diesen Markt:</h5>
        <p>
          {{shopParams.additionalInfo}}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase/app";
import { selectUnit } from "@formatjs/intl-utils";
import CountDown from "@/components/CountDown";
import InformationBox from "@/components/InformationBox";
import QRCode from "@/components/QRCode.vue";
import { getPlaceDetails } from "@/api/google-maps";
import { getRandomDocument } from "@/util/firebase-rng";
import Queue from "@/components/Queue";

const db = firebase.firestore();

const ONE_HOUR = 60 * 60 * 1000;

export default {
  name: "market",
  props: {
    id: String
  },
  components: {Queue, QRCode, CountDown, InformationBox },
  computed: {
    queueRef() {
      return db.collection("queues").doc(this.id);
    },
    inQ() {
      return this.queue.some(
        ({ uid }) => uid === firebase.auth().currentUser.uid
      );
    },
    positionInQ() {
      if (!this.inQ) {
        return -1;
      }
      return this.queue.findIndex(
        ({ uid }) => uid === firebase.auth().currentUser.uid
      );
    },
    shopParams() {
      return {
        ...this.defaultShopParams,
        ...(this.shop || {})
      };
    },
    queueSlot() {
      if (!this.inQ) {
        return null;
      }
      return this.queue.find(
        ({ uid }) => uid === firebase.auth().currentUser.uid
      );
    },
    freeSlots() {
      if (this.loading) {
        return null;
      }
      return this.shopParams.capacity - ((this.admittance || {}).count || 0);
    },
    isUserAnonymous() {
      return firebase.auth().currentUser.isAnonymous;
    },
    shoppingTimeEnd() {
      let start = new Date();
      if (this.ticketAdmission && this.ticketAdmission.length) {
        const [admission] = this.ticketAdmission;
        start = new Date(admission.timestamp.toDate());
      }
      return new Date(start.getTime() + this.shop.maxShoppingTime * 60 * 1000);
    },
    latestActivity() {
      if (
        !this.latestAdmittanceEvent ||
        this.latestAdmittanceEvent.length === 0
      ) {
        return null;
      }
      const [event] = this.latestAdmittanceEvent;
      const ts = new Date(event.timestamp.toDate());
      const diff = selectUnit(ts);
      return this.rtf.format(diff.value, diff.unit);
    }
  },
  beforeDestroy() {
    this.stage = "default";
  },
  watch: {
    freeSlots(newVal) {
      let name = this.placeDetails.name;
      if (newVal > 0 && this.positionInQ === 0) {
        if (
          "Notification" in window &&
          Notification.permission === "granted" &&
          this.stage === "waiting-in-q"
        ) {
          new Notification("Sie sind dran! 🎉", {
            body: "Willkommen bei " + name + "."
          });
        }
        this.stage = "q-finished";
      }
    },
    positionInQ(newVal, oldVal) {
      if (oldVal >= 2 && newVal === 1) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Gleich ist es geschafft!", {
            body: "Sie sind der nächste, der in den Laden darf 📯"
          });
        }
      }
    },
    ticketAdmission(admitted) {
      if (admitted && admitted.length) {
        const [admission] = admitted;
        if (
          admission.inactive ||
          admission.timestamp.toDate() < Date.now() - ONE_HOUR
        ) {
          this.stage = "default";
          return;
        }
        this.stage = "q-finished";
      }
    }
  },
  data() {
    return {
      loading: true,
      placeDetails: null,
      queue: [],
      shop: null,
      stage: "default",
      defaultShopParams: null,
      admittance: null,
      ticketAdmission: null,
      latestAdmittanceEvent: null,
      rtf: new Intl.RelativeTimeFormat("de", { numeric: "auto" })
    };
  },
  firestore: {
    defaultShopParams: db.collection("shops").doc("default")
  },
  methods: {
    async initialize() {
      try {
        await this.$bind(
          "admittance",
          db.collection("admittances").doc(this.id)
        );
        await this.$bind("shop", db.collection("shops").doc(this.id));
        if (this.shop && this.shop.placeDetails) {
          this.placeDetails = this.shop.placeDetails;
        } else {
          try {
            this.placeDetails = await getPlaceDetails(this.id);
          } catch (e) {
            this.stage = "not-found";
          } finally {
            this.loading = false;
          }
        }
        if (this.stage === "not-found") {
          return;
        }
        await this.$bind(
          "latestAdmittanceEvent",
          firebase
            .firestore()
            .collection("admittanceEvents")
            .where("shopId", "==", this.id)
            .orderBy("timestamp", "desc")
            .limit(1)
        );

        await this.$bind(
          "queue",
          this.queueRef.collection("users").orderBy("joinedAt", "asc")
        );

        await this.$bind(
          "ticketAdmission",
          db
            .collection("ticketAdmission")
            .where("uid", "==", firebase.auth().currentUser.uid)
            .orderBy("timestamp", "desc")
            .limit(1)
        );
        if (
          this.queue.some(({ uid }) => uid === firebase.auth().currentUser.uid)
        ) {
          this.stage = "waiting-in-q";
        }
      } finally {
        this.loading = false;
      }
    },
    async generateTicketCode() {
      return (
        await getRandomDocument(
          firebase
            .firestore()
            .collection("randomWords")
            .doc("de")
            .collection("vegetables")
        )
      ).data().word;
    },
    async joinQ() {
      if ("Notification" in window) {
        Notification.requestPermission();
      }
      const ticketId = db.collection("tickets").doc().id;
      const ticketCode = await this.generateTicketCode();
      await this.queueRef.collection("users").add({
        uid: firebase.auth().currentUser.uid,
        ticketId,
        ticketCode: ticketCode,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      // to notify if we are done
      this.stage = "waiting-in-q";
    },
    async quitQ() {
      const snap = await this.queueRef
        .collection("users")
        .where("uid", "==", firebase.auth().currentUser.uid)
        .get();
      //.delete();
      snap.forEach(doc => {
        doc.ref.delete();
      });
      this.stage = "default";
    },
    async setAdmissionInactive() {
      db.collection("ticketAdmission")
        .doc(this.ticketAdmission[0].id)
        .update({
          inactive: true
        });
    }
  },
  async mounted() {
    await this.initialize();
    if (!this.shop && this.stage !== "not-found") {
      this.stage = "no-support";
    }
  }
};
</script>
<style type="text/css" scoped>
#market {
  margin: 0 12px;
  padding-bottom: 12px;
}
#market-header {
  display: flex;
  flex-direction: column;
}
.primary-interaction {
  margin: 30px 0;
  display: flex;
  flex-direction: column;
}
#joinQ-btn,
#quitQ-btn {
  width: 100%;
  max-width: 480px;
  margin: 4px auto;
}

#ticket {
  border: 1px solid var(--border-color);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 15px auto;
  border-radius: 4px;
  transition: border 280ms cubic-bezier(0.43, 0, 0.37, 0.94);
}
#ticket-header{
  padding: 12px 16px;
}
#ticket-code{
  width: 80%;
}
#ticket-word {
  border-top: 1px solid var(--border-color);
  padding: 12px 16px;
  font-weight: bold;
  transition: background-color 280ms cubic-bezier(0.43, 0, 0.37, 0.94);
}
#ticket.active {
  border-color: var(--warning-color);
  animation-name: pulse;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: cubic-bezier(0.43, 0, 0.37, 0.94);
}
#ticket.active > #ticket-word{
  background-color: var(--warning-color);
}
@keyframes pulse {
  from {
    box-shadow: 0 0 6px rgba(--warning-color);
  }
  to {
    box-shadow: 0 0 12px var(--warning-color);
  }
}
#quitQ-btn {
  background-color: transparent;
  color: var(--danger-color);
  border-color: var(--danger-color);
}

#you-made-it {
  margin: 30px 0;
  font-size: 2em;
  font-weight: bold;
}
#you-made-it > #store {
  background-color: var(--success-color);
  padding: 4px 6px;
  margin: 4px;
  border-radius: 4px;
}
#shopq-info {
  padding: 4px 6px;
  margin: 4px;
  margin-top: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
#shopq-info h5 {
  margin: 0;
}
</style>
