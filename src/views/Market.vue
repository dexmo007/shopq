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

    <div class="info">

      {{!placeDetails ? 'Loading...' : placeDetails}}
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
    WaitingTimeStr() {
      return "12min";
    },
    positionInQ() {
      return 4;
    }
  },
  data() {
    return {
      placeDetails: null,
      inQ: false,
      queue: null
    };
  },
  methods: {
    joinQ() {
      this.inQ = true;
    },
    quitQ() {
      this.inQ = false;
    }
  },
  async mounted() {
    this.$bind("queue", db.collection("queues").doc(this.id));
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
