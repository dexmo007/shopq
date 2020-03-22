<template>
  <div v-if="loading">
    Loading...
  </div>
  <div
    class="market"
    v-else
  >
    <h1>
      <div
        v-if="placeDetails.opening_hours"
        id="isOpenDot"
        :class="{'open': placeDetails.opening_hours.isOpen()}"
        :title="placeDetails.opening_hours.isOpen() ? 'geöffnet' : 'geschlossen'"
      />
      {{placeDetails.name}}</h1>
    <span>
      <font-awesome-icon icon="map-marked-alt" /> {{placeDetails.vicinity}}</span>
    <div
      id="primary-interaction"
      v-if="!inQ"
    >
      <button
        id="joinQ-btn"
        @click="joinQ()"
      >virtuell anstellen</button>
      <span>{{queue.length}} Personen in der Schlange</span>
      <span v-if="WaitingTimeStr">geschätzte Wartezeit: <b>{{WaitingTimeStr}}</b></span>
    </div>
    <div v-else>
      <span>Sie sind der <b>{{positionInQ+1}}.</b> in der Schlange.</span>
      <div>
        <span>Dein Ticket:</span>
        <QRCode :text="yourTicketCode" />
        <span>{{yourTicketCode}}</span>
      </div>
      <button
        id="quitQ-btn"
        @click="quitQ()"
      >Schlange verlassen</button>
    </div>

    <div class="shopq-info">
      {{!shop && !defaultShopParams ? 'Loading...' : shopParams}}
    </div>

    <div class="general-info">

      {{!placeDetails ? 'Loading...' : placeDetails.name+'('+placeDetails.vicinity+')'}}
    </div>

    <div class="card">
      <h2>Auslastung am Vortag</h2>
      <p></p>
    </div>
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps";
import firebase from "firebase/app";
import QRCode from "@/components/QRCode.vue";

const db = firebase.firestore();

export default {
  name: "market",
  props: {
    id: String
  },
  components: { QRCode },
  computed: {
    google: gmapApi,
    queueRef() {
      return db.collection("queues").doc(this.id);
    },
    WaitingTimeStr() {
      return "12min";
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
    yourTicketCode() {
      if (!this.inQ) {
        return null;
      }
      return this.queue.find(
        ({ uid }) => uid === firebase.auth().currentUser.uid
      ).ticketCode;
    }
  },
  watch: {
    positionInQ(newVal) {
      let name = this.placeDetails.name;
      if (newVal === 0 && this.inQ) {
        if (Notification.permission === "granted") {
          navigator.serviceWorker.getRegistration().then(reg => {
            // console.log(reg);

            reg.showNotification("Willkommen bei " + name + ". Sie sind dran!");
          });
        }
      }
    }
  },
  data() {
    return {
      loading: true,
      placeDetails: null,
      queue: [],
      shop: null,
      defaultShopParams: null
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
      this.queueRef.collection("users").add({
        uid: firebase.auth().currentUser.uid,
        ticketCode: this.generateTicketCode()
      });
      // to notify if we are done
      Notification.requestPermission();
    },
    async quitQ() {
      await this.queueRef
        .collection("users")
        .where("uid", "==", firebase.auth().currentUser.uid)
        .delete();
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
#primary-interaction {
  margin: 30px 0;
}
#joinQ-btn {
  background-color: #64c7a6;
  color: #2c3e50;
  width: 100%;
  max-width: 480px;
  margin: 4px auto;
  border: 1px solid rgba(33, 33, 33, 0.4);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
}
#joinQ-btn:hover {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
}
#quitQ-btn {
  background-color: transparent;
  color: #dd363a;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}
</style>
