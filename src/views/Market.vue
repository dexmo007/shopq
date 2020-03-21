<template>
  <div class="market">
    <h1>Laden #{{id}}</h1>
    <div id="primary-interaction" v-if="!inQ">
      <button id="joinQ-btn" @click="joinQ()">virtuell anstellen</button>
      <span v-if="WaitingTimeStr">geschätzte Wartezeit: <b>{{WaitingTimeStr}}</b></span>
    </div>
    <div v-else>
      <span>Sie sind der <b>{{positionInQ}}.</b> in der Schlange.</span>
      <button id="quitQ-btn" @click="quitQ()">Schlange verlassen</button>
    </div>
    <div class="card">
      <h2>Auslastung am Vortag</h2>
      <p></p>
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
      //console.log(this.id);
   },
   computed: {
     WaitingTimeStr () {
        return "12min";
     },
     positionInQ (){
       return 4;
     }

   },
   data() {
     return {
       inQ: false
     }
   },
   methods: {
     joinQ(){
       this.inQ = true;
     },
     quitQ(){
       this.inQ = false;
     }
   }

 }
</script>
<style type="text/css" scoped>
  #joinQ-btn{
    background-color: #64c7a6;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  }
  #quitQ-btn{
    background-color: transparent;
    color: #dd363a;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  }
</style>