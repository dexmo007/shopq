<template>
  <AutoComplete
    id="search-input"
    v-bind="$attrs"
    v-on="$listeners"
    :types="['establishment']"
    :bounds="bounds"
    :options="options"
    :placeholder="userAddress || $attrs.placeholder || 'In der Nähe suchen...'"
  />
</template>

<script>
import AutoComplete from "vue2-google-maps/dist/components/autocomplete";
import { gmapApi } from "vue2-google-maps";

export default {
  name: "PlaceAutoComplete",
  components: { AutoComplete },
  data() {
    return {
      place: null,
      bounds: null,
      options: {},
      userAddress: null
    };
  },
  computed: {
    google: gmapApi
  },
  async mounted() {
    await this.$gmapApiPromiseLazy();
    navigator.geolocation.getCurrentPosition(position => {
      this.prepareAutoComplete(position);
      this.reverseGeocode(position);
    });
  },
  methods: {
    prepareAutoComplete(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const geolocation = {
        lat,
        lng
      };
      const google = this.google;
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      const bounds = circle.getBounds();
      this.bounds = bounds;
      this.options.origin = `${lat},${lng}`; // TODO this won't work :(
    },
    reverseGeocode(position) {
      const google = this.google;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        },
        (results, status) => {
          if (status === "OK" && results[0]) {
            this.userAddress = results[0].formatted_address;
          }
        }
      );
    }
  }
};
</script>
<style scoped>
#search-input{
 border: none;
 margin-left: 6px;
}
</style>