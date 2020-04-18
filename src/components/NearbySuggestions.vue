<template>
  <div id="nearby">
    <h1>{{title}}</h1>
    <div id="suggestions-wrapper" v-if="status === 'found-suggestions'">
      <router-link
              to="markt/123"
              tag="div"
              class="suggestion"
      >
        <div class="suggestion-info">
          <span class="suggestion-name">Rewe</span>
          <span class="suggestion-addr">Teststraße 123 Berlin</span>
        </div>
        <div class="suggestion-realtime" >
          <div class="suggestion-q-text">Keine<br/>Schlange!</div>
        </div>
      </router-link>
      <router-link
              to="markt/123"
              tag="div"
              class="suggestion"
      >
        <div class="suggestion-info">
          <span class="suggestion-name">Aldi</span>
          <span class="suggestion-addr">abc street 456 TempTown</span>
        </div>
        <div class="suggestion-realtime">
          <div class="suggestion-q-counter">
            12
          </div>
          <div class="suggestion-q-text">Personen in<br/> der Schlange</div>
        </div>
      </router-link>
      <router-link
        v-for="market in suggestions"
        :key="market.id"
        :to="'markt/' + market.place_id"
        tag="div"
        class="suggestion"
        :style="{backgroundColor: market.color}"
      >
        <div class="suggestion-info">
          <span class="suggestion-name">{{market.name}}</span>
          <span class="suggestion-addr">{{market.vicinity}}</span>
        </div>
        <div class="suggestion-realtime-empty"/>
      </router-link>
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
          console.log(nearbyPlaces);
          this.status = "found-suggestions";
          this.suggestions = nearbyPlaces;
        }
      );
    }, positionError => {
      console.error(positionError);
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
.suggestion {
  width: 100%;
  max-width: 380px;
  margin: 14px;
  border: 1px solid rgba(33, 33, 33, 0.4);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.2);
}


.suggestion-info, .suggestion-q-text, .suggestion-q-counter{
  transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
}

.suggestion-info{
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
.suggestion:hover .suggestion-info{
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}

.suggestion-q-text{
 box-shadow: 0 0 5px rgba(100, 199, 166, 0.8);
}
.suggestion:hover .suggestion-q-text{
box-shadow: 0 0 12px rgba(100, 199, 166, 1);
}

.suggestion-q-counter{
  z-index: 1;
   box-shadow: 0 0 5px rgba(43, 62, 80,0.2);
 }
.suggestion:hover .suggestion-q-counter{
  box-shadow: 0 0 12px rgba(43, 62, 80,0.4);
}

.suggestion-info{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  padding: 10px;
  text-align: initial;
  background: white;
  z-index: 1;
  flex: 1;
  border-radius: 4px 0 0 4px;
}
/* this is needed, to get all 4 corners smooth */
.suggestion-realtime-empty{
  border-radius: 0 4px 4px 0;
  width: 4px;
  background: white;
  z-index: 2;
}
.suggestion-name {
  font-size: 1.2em;
  font-weight: bold;
}
.suggestion-addr {
  font-size: 1em;
}
.suggestion-realtime{
  background-color: rgb(100, 199, 166);
  border: 1px solid rgba(33, 33, 33, 0.4);
  display: flex;
  justify-content: center;
  border-radius: 0 4px 4px 0;
  margin-top: -1px;
  margin-bottom: -1px;
  margin-right: -1px;
}

.suggestion-q-counter{
  font-size: 2em;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: #2b3e50;
  color: white;
  margin: -1px;
  border: 1px solid rgba(0,0,0,0.4);
}
.suggestion-q-text{
  padding: 10px;
  width: 96px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
