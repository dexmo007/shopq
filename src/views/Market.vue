<template>
  <div class="market">
    <h1>Laden #{{id}}</h1>
    <div id="primary-interaction">
      <button id="joinQ-btn" @click="joinQ()">virtuell anstellen</button>
      <span v-if="WaitingTimeStr">geschätzte Wartezeit: {{WaitingTimeStr}}</span>
    </div>
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
   },
   computed: {

     WaitingTimeStr () {
        return "12min";
     }
   },
   methods: {
     joinQ(){

     }
   }

 }
</script>
<style type="text/css">
  #joinQ-btn{
    display: block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
    background-color: #64c7a6;
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
  }
</style>