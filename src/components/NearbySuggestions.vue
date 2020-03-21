<template>
  <div id="nearby">
    <h1>{{title}}</h1>
    <div id="wrapper">
      <router-link
        v-for="market in suggestions"
        :key="market.id"
        :to="'markt/' + market.id"
        tag="div"
        class="suggestion"
        :style="{backgroundColor: market.color}"
      >
        {{market}}
      </router-link>
    </div>
  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";

export default {
  name: "NearbySuggestions",
  props: {
    title: {
      type: String,
      default: "In der Nähe"
    }
  },
  data() {
    return {
      suggestions: null
      // suggestions: [
      //   {name: "REWE", color: "rgb(255, 121, 121)", id:1},
      //   {name: "EDEKA", color: "rgb(255, 221, 128)", id:2},
      // ]
    };
  },
  computed: {
    google: gmapApi
  },
  watch: {
    google(google) {
      navigator.geolocation.getCurrentPosition(position => {
        const service = new google.maps.places.PlacesService(
          document.createElement("div")
        );
        service.nearbySearch(
          {
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            // radius: 5000,
            type: "supermarket",
            rankBy: google.maps.places.RankBy.DISTANCE
          },
          nearbyPlaces => {
            this.suggestions = nearbyPlaces;
            console.log(nearbyPlaces);
          }
        );
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#wrapper {
  display: flex;
  flex-wrap: wrap;
}
.suggestion {
  width: 120px;
  height: 120px;
  border: 1px solid rgba(33, 33, 33, 0.4);
  border-radius: 4px;
  margin: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
}
.suggestion:hover {
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
}
</style>
