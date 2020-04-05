<template>
  <div>
    <div id="market-header">
      <router-link
            to="./"
            tag="h1">{{!placeDetails ? 'Name lädt...' : placeDetails.name}}</router-link>
      <span>
        <font-awesome-icon icon="map-marked-alt" />
        {{!placeDetails ? 'Addresse lädt...' : placeDetails.vicinity}}
      </span>
    </div>
    <p>
      Mit Klick auf den Button stimmen Sie den AGB's und allgemeinen Geschäftisbedingungen zu
    </p>
    <button @click="claim" class="success">
      shopQ für {{!placeDetails ? 'ihr Geschäft' : placeDetails.name}} nutzen
    </button>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { getPlaceDetails } from "@/api/places";

export default {
  props: ["id"],
  data(){
    return {
      placeDetails: null,
    }
  },
  async mounted(){
    this.placeDetails = await getPlaceDetails(this.id);
  },
  methods: {
    async claim() {
      await firebase
        .firestore()
        .collection("shopControl")
        .doc(this.id)
        .set({
          admins: [firebase.auth().currentUser.uid]
        });
      this.$router.push(`/markt/${this.id}/control`);
    }
  }
};
</script>
