<template>
  <div v-if="loading">
    Loading...
  </div>
  <div
    id="market"
    v-else
  >
    <h1>
      <!--      <div-->
      <!--        v-if="placeDetails.opening_hours"-->
      <!--        id="isOpenDot"-->
      <!--        :class="{'open': placeDetails.opening_hours.isOpen()}"-->
      <!--        :title="placeDetails.opening_hours.isOpen() ? 'geöffnet' : 'geschlossen'"-->
      <!--      />-->
      {{!placeDetails ? 'Name lädt...' : placeDetails.name}}</h1>
    <span>
      <font-awesome-icon icon="map-marked-alt" /> {{!placeDetails ? 'Addresse lädt...' : placeDetails.vicinity}}</span>

    <div v-if="stage === 'default'">
      <div v-if="freeSlots > 0">
        <h2>Es gibt keine Schlange!</h2>
        <span>Sie können zur Zeit ohne anzustehen einkaufen gehen.</span>
        <span>{{freeSlots}}/{{shop.capacity}} Plätze frei!</span>
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
        <span><b>{{queue.length}}</b> Personen in der Schlange</span><br>
        <span v-if="WaitingTimeStr">geschätzte Wartezeit: <b>{{WaitingTimeStr}}</b></span>
      </div>
    </div>

    <div
      v-if="stage === 'q-finished'"
      id="you-made-it"
    >
      <span>Viel Spaß</span><br>
      <span id="store">beim 🛒!</span>
      <count-down
        v-if="shopParams.freeSlots <= 0"
        @end-timer="inStore = false"
        :end-date="new Date(new Date().getTime() + (shopParams.maxShoppingTime * 60 * 1000))"
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
        v-if="queueSlot"
      >
        <b>Dein Ticket:</b>
        <QRCode :text="queueSlot.ticketCode" />
        <span>{{queueSlot.ticketCode}}</span>
      </div>
      <button
        id="quitQ-btn"
        @click="quitQ()"
      >Schlange verlassen</button>
    </div>

    <div id="shopq-info">
      <h5>Zusatzinfo für diesen Markt:</h5>
      <p>
        {{!shop && !defaultShopParams ? 'Loading...' : (shopParams.additionalInfo) ? shopParams.additionalInfo : ''}}
      </p>
    </div>

    <!-- <div class="card">
      <h2>Auslastung am Vortag</h2>
      <div style="font-size: 5em">
      </div>
    </div> -->
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps";
import firebase from "firebase/app";
import CountDown from "@/components/CountDown";
import QRCode from "@/components/QRCode.vue";

const db = firebase.firestore();

const ONE_HOUR = 60 * 60 * 1000;

export default {
  name: "market",
  props: {
    id: String
  },
  components: { QRCode, CountDown },
  computed: {
    google: gmapApi,
    queueRef() {
      return db.collection("queues").doc(this.id);
    },
    WaitingTimeStr() {
      return null;
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
        ...this.shop
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
      if (![this.shopParams, this.admittance].every(v => !!v)) {
        return null;
      }
      return this.shopParams.capacity - this.admittance.count;
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
      ticketAdmission: null
    };
  },
  firestore: {
    defaultShopParams: db.collection("shops").doc("default")
  },
  methods: {
    async getPlaceDetails() {
      await this.$gmapApiPromiseLazy();
      const google = this.google;
      return new Promise(resolve => {
        const service = new google.maps.places.PlacesService(
          document.createElement("div")
        );
        service.getDetails(
          {
            placeId: this.id
          },
          placeDetails => {
            resolve(placeDetails);
          }
        );
      });
    },
    async initialize() {
      try {
        this.placeDetails = await this.getPlaceDetails();
        await this.$bind("shop", db.collection("shops").doc(this.id));
        await this.$bind("queue", this.queueRef.collection("users"));
        await this.$bind(
          "admittance",
          db.collection("admittances").doc(this.id)
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
    generateTicketCode() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return Array(5)
        .fill()
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("");
    },
    async joinQ() {
      if ("Notification" in window) {
        Notification.requestPermission();
      }
      const ticketId = db.collection("tickets").doc().id;
      await this.queueRef.collection("users").add({
        uid: firebase.auth().currentUser.uid,
        ticketId,
        ticketCode: this.generateTicketCode()
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
  }
};
</script>
<style type="text/css" scoped>
#isOpenDot {
  width: 0.85em;
  height: 0.85em;
  display: inline-block;
  border-radius: 50%;
  background-color: #dd363a;
  transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
}
#isOpenDot.open {
  background-color: #64c7a6;
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
  border: 1px solid rgba(33, 33, 33, 0.3);
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 15px auto;
  padding: 18px;
  border-radius: 4px;
}
#quitQ-btn {
  background-color: transparent;
  color: #dd363a;
  border-color: #dd363a;
}

#you-made-it {
  margin: 30px 0;
  font-size: 2em;
  font-weight: bold;
}
#you-made-it > #store {
  background-color: #64c7a6;
  padding: 4px 6px;
  margin: 4px;
  border-radius: 4px;
}
#shopq-info {
  padding: 4px 6px;
  margin: 4px;
  margin-top: 10px;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
}
#shopq-info h5 {
  margin: 0;
}
</style>
