<template>
  <div id="nearby">
    <h1>{{title}}</h1>
    <div id="suggestions-wrapper" v-if="status === 'found-suggestions'">
      <market-preview
        class="suggestion"
        v-for="market in suggestions"
        :key="market.id"
        :market="market"/>
    </div>
    <div v-if="status === 'location-disabled'">
      <label>
        PLZ eingeben:
        <input placeholder="PLZ"/>
      </label>
    </div>
  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";
import MarketPreview from "@/components/MarketPreview";

export default {
  name: "NearbySuggestions",
  props: {
    title: {
      type: String,
      default: "In der Nähe"
    }
  },
  components: {MarketPreview},
  data() {
    return {
      suggestions: null,
      status: "searching"
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
          this.status = "found-suggestions";
          this.suggestions = nearbyPlaces;
        }
      );
    }, () => {
      this.status = "location-disabled";
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#suggestions-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  max-width: 480px;
  margin: 0 auto;
}
.suggestion{
  width: 100%;
}
</style>
