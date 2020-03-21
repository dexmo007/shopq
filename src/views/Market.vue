<template>
  <div class="market">
    <h1>Laden #{{id}}</h1>
  </div>
</template>
<script>
 export default {
    name: 'market',
    props: {
      id: String
    },
   created() {
      console.log(this.id);
   }
 }
</script>