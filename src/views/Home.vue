<template>
  <div id="home_container">
    <label id="search">
      <font-awesome-icon icon="search" />
      <input type="text" placeholder=""/>
    </label>
    <NearbySuggestions/>
  </div>
</template>

<script>
// @ is an alias to /src
import NearbySuggestions from '@/components/NearbySuggestions.vue'

export default {
  name: 'home',
  components: {
    NearbySuggestions
  }
}
</script>
