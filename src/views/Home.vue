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
    margin: 4px 0;
    border: 1px solid #2c3e50;
    border-radius: 4px;
    padding: 0.375rem 0.75rem;
    transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    outline: none;
  }
  #search:focus{
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
    border-color: #64c7a6;
  }
</style>