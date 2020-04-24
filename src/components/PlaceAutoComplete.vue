<template>
  <AutoComplete
    id="search-input"
    class="blank"
    v-bind="$attrs"
    v-on="$listeners"
    :types="['establishment']"
    :bounds="bounds"
    :options="options"
    :placeholder="userAddress || $attrs.placeholder || 'Geschäft suchen...'"
  />
</template>

<script>
import AutoComplete from "vue2-google-maps/dist/components/autocomplete";
import { getGoogleApi, geocode } from "@/api/google-maps";

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
  async mounted() {
    navigator.geolocation.getCurrentPosition(position => {
      this.prepareAutoComplete(position);
      this.reverseGeocode(position);
    });
  },
  methods: {
    async prepareAutoComplete(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const geolocation = {
        lat,
        lng
      };
      const google = await getGoogleApi();
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      const bounds = circle.getBounds();
      this.bounds = bounds;
      this.options.origin = `${lat},${lng}`; // TODO this won't work :(
    },
    async reverseGeocode(position) {
      const result = await geocode({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      });
      this.userAddress = result.formatted_address;
    }
  }
};
</script>
<style scoped>
#search-input {
  border: none;
  outline: none;
  margin-left: 6px;
}
</style>
