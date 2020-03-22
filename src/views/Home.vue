<template>
  <div id="home_container">
    <label id="search">
      <font-awesome-icon icon="search" />
      <PlaceAutoComplete @place_changed="onPlaceSelected" />
    </label>
    <NearbySuggestions />
  </div>
</template>

<script>
import NearbySuggestions from "@/components/NearbySuggestions.vue";
import PlaceAutoComplete from "@/components/PlaceAutoComplete.vue";

export default {
  name: "home",
  components: {
    PlaceAutoComplete,
    NearbySuggestions
  },
  methods: {
    onPlaceSelected(place) {
      this.$router.push(`/markt/${place.place_id}`);
    }
  }
};
</script>
<style scoped>
  #search{
    border: 1px solid;
    padding: 4px;
    border-radius: 2px;
  }
</style>