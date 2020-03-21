<template>
  <AutoComplete
    :types="['establishment']"
    :bounds="bounds"
    @place_changed="$emit('place_changed', $event)"
    :options="options"
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
      position: null,
      options: {}
    };
  },
  computed: {
    google: gmapApi
  },
  watch: {
    google() {
      const lat = this.position.coords.latitude;
      const lng = this.position.coords.longitude;
      const geolocation = {
        lat,
        lng
      };
      const google = this.google;
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: this.position.coords.accuracy
      });
      const bounds = circle.getBounds();
      this.bounds = bounds;
      this.options.origin = `${lat},${lng}`; // TODO this won't work :(
    }
  },
  mounted() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.position = position;
      },
      error => {
        console.log(error);
      }
    );
  }
};
</script>
