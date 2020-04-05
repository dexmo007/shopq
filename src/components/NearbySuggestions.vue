<template>
  <div id="nearby">
    <h1>{{title}}</h1>
    <div id="wrapper">
      <router-link
        v-for="market in suggestions"
        :key="market.id"
        :to="'markt/' + market.place_id"
        tag="div"
        class="suggestion"
        :style="{backgroundColor: market.color}"
      >
        <span class="suggestion-name">{{market.name}}</span>
        <span class="suggestion-addr">{{market.vicinity}}</span>
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
    };
  },
  mounted() {
    navigator.geolocation.getCurrentPosition(async position => {
      await this.$gmapApiPromiseLazy();
      const google = gmapApi();
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
        }
      );
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#wrapper {
  display: flex;
  flex-wrap: wrap;
  max-width: 480px;
  margin: 0 auto;
}
.suggestion {
  width: 190px;
  height: 190px;
  border: 1px solid rgba(33, 33, 33, 0.4);
  background-color: rgb(100, 199, 166);
  border-radius: 4px;
  margin: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
}
.suggestion:hover {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
}
.suggestion-name {
  font-weight: bold;
}
.suggestion-addr {
  font-size: 0.8em;
}
</style>
