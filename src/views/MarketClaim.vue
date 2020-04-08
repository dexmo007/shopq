<template>

  <div v-if="loading">
    loading...
  </div>
  <div v-else>
    <div id="market-header">
      <router-link
            to="./"
            tag="h1">{{!placeDetails ? 'Name lädt...' : placeDetails.name}}</router-link>
      <span>
        <font-awesome-icon icon="map-marked-alt" />
        {{!placeDetails ? 'Addresse lädt...' : placeDetails.vicinity}}
      </span>
    </div>
    <form @submit.prevent="claim">
      <section id="market-capacity">
        <p>
          <b>Bevor es losgeht:</b>
          Legen Sie fest, wie viele Kunden ihr Geschäft gleichzeitig betreten dürfen.
        </p>
        <label>Kapazität: <input
                type="number"
                v-model.number="form.capacity"
        ><span class="default-value">Sie können die Kapazität ihres Geschäfts jederzeit anpassen.</span></label>
      </section>
      <section>
        <p>
          Mit Klick auf den Button stimmen Sie den
          <router-link to="/agb">AGB's</router-link> und
          <router-link to="/agb">allgemeinen Geschäftisbedingungen</router-link> zu.
        </p>
        <button type="submit" class="success">
          shopQ für {{!placeDetails ? 'ihr Geschäft' : placeDetails.name}} nutzen
        </button>
      </section>
    </form>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { getPlaceDetails } from "@/api/places";

export default {
  props: ["id"],
  data(){
    return {
      loading: true,
      placeDetails: null,
      form: {
        capacity: 20,
      }
    }
  },
  async mounted(){
    try {
      this.placeDetails = await getPlaceDetails(this.id);
    } finally {
      console.log(this.placeDetails);
      this.loading = false;
    }
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
<style scoped>
  #market-header{
    padding-bottom: 21px;
  }
</style>