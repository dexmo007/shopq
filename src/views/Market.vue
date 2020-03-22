<template>
  <div class="market">
    <h1>Laden #{{id}}</h1>
    <div
      id="primary-interaction"
      v-if="!inQ"
    >
      <button
        id="joinQ-btn"
        @click="joinQ()"
      >virtuell anstellen</button>
      <span v-if="WaitingTimeStr">geschätzte Wartezeit: <b>{{WaitingTimeStr}}</b></span>
    </div>
    <div v-else>
      <span>Sie sind der <b>{{positionInQ}}.</b> in der Schlange.</span>
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
      return (
        this.queue.users
          .map(({ uid }) => uid)
          .indexOf(firebase.auth().currentUser.uid) + 1
      );
    },
    shopParams() {
      return {
        ...this.defaultShopParams,
        ...this.shop
      };
    }
  },
  data() {
    return {
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
    joinQ() {
      this.queueRef.set(
        {
          users: firebase.firestore.FieldValue.arrayUnion({
            uid: firebase.auth().currentUser.uid
          })
        },
        { merge: true }
      );
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
    this.$bind("queue", this.queueRef);
    this.$bind("shop", db.collection("shops").doc(this.id));
    await this.$gmapApiPromiseLazy();
    const google = this.google;
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails(
      {
        placeId: this.id
      },
      placeDetails => {
        this.placeDetails = placeDetails;
      }
    );
  }
};
</script>
<style type="text/css" scoped>
#joinQ-btn {
  background-color: #64c7a6;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}
#quitQ-btn {
  background-color: transparent;
  color: #dd363a;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}
</style>
