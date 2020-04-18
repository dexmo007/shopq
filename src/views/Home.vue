<template>
  <div id="home_container">
    <div id="main" :style="{ backgroundImage: 'url(' + require('@/assets/images/about_bg.jpg') + ')' }">
      <label id="search" :class="{focus: isFocus}">
        <font-awesome-icon icon="search" id="search-icon" />
        <PlaceAutoComplete
                id="search-input"
                @place_changed="onPlaceSelected"
                @blur="isFocus = false"
                @focus="isFocus = true"/>
      </label>
    </div>
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
  data(){
    return {
      isFocus: null
    }
  },
  methods: {
    onPlaceSelected(place) {
      this.$router.push(`/markt/${place.place_id}`);
    }
  }
};
</script>
<style scoped>
  #main{
    margin-top: -50px;
    background: #373737;
    width: 100%;
    height: 380px;
    background-size: cover;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 12px rgb(0, 0, 0);
  }
  #search{
    font-size: 1.4em;
    display: flex;
    align-items: center;
    background: white;
    margin: 4px 0;
    border: 1px solid #2c3e50;
    border-radius: 4px;
    padding: 0.375rem 0.75rem;
    transition: all 280ms cubic-bezier(0.43, 0, 0.37, 0.94);
    box-shadow: 0 0 12px 3px rgba(0, 0, 0, 0.2);
    outline: none;
  }
  #search-icon{
    transition: color 280ms cubic-bezier(0.43, 0, 0.37, 0.94);
  }
  #search-input{
    font-size: 1.2rem;
  }
  #search.focus{
    border-color: #64c7a6;
    box-shadow: 0 0 12px 3px rgba(0, 0, 0, 0.42);
  }
  #search.focus > #search-icon{
    color: #64c7a6;
  }
</style>