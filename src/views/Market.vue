<template>
  <div v-if="loading">
    Loading...
  </div>
  <div
    id="market"
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
      class="primary-interaction"
      v-if="!inQ"
    >
      <button
        class="success"
        id="joinQ-btn"
        @click="joinQ()"
      >virtuell anstellen</button>
      <span v-if="WaitingTimeStr">geschätzte Wartezeit: <b>{{WaitingTimeStr}}</b></span>
    </div>
    <div
      class="primary-interaction"
      v-else
    >
      <span>Sie sind der <b>{{positionInQ+1}}.</b> in der Schlange.</span>
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

const db = firebase.firestore();

export default {
  name: "market",
  props: {
    id: String
  },
  computed: {
    google: gmapApi,
    queueRef() {
      return db.collection("queues").doc(this.id);
    },
    WaitingTimeStr() {
      return "12min";
    },
    inQ() {
      return (
        this.queue &&
        this.queue.users.some(
          ({ uid }) => uid === firebase.auth().currentUser.uid
        )
      );
    },
    positionInQ() {
      if (!this.inQ) {
        return -1;
      }
      return this.queue.users
        .map(({ uid }) => uid)
        .indexOf(firebase.auth().currentUser.uid);
    },
    shopParams() {
      return {
        ...this.defaultShopParams,
        ...this.shop
      };
    }
  },
  watch: {
    positionInQ(newVal, oldVal) {
      let name = this.placeDetails.name;
      if (oldVal !== -1 && newVal === 0) {
        if (Notification.permission === "granted") {
          new Notification("Sie sind dran! 🎉", {body: "Willkommen bei " + name + "."});
        }
      }

      if (oldVal !== 2 && newVal === 1) {
        if (Notification.permission === "granted") {
          new Notification("Gleich ist es geschafft!", {body: "Sie sind der nächste, der in den Laden darf 📯"});
        }
      }
    }
  },
  data() {
    return {
      loading: true,
      placeDetails: null,
      queue: null,
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
        await this.$bind("queue", this.queueRef);
      } finally {
        this.loading = false;
      }
    },
    joinQ() {
      this.queueRef.set(
        {
          users: firebase.firestore.FieldValue.arrayUnion({
            uid: firebase.auth().currentUser.uid
          })
        },
        { merge: true }
      );
      // to notify if we are done
      Notification.requestPermission();
    },
    quitQ() {
      this.queueRef.set(
        {
          users: firebase.firestore.FieldValue.arrayRemove({
            uid: firebase.auth().currentUser.uid
          })
        },
        { merge: true }
      );
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
}
#joinQ-btn, #quitQ-btn{
  width: 100%;
  max-width: 480px;
  margin: 4px auto;
}

#quitQ-btn {
  background-color: transparent;
  color: #dd363a;
  border-color: #dd363a;
}
</style>
