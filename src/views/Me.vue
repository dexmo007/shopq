<template>
  <div v-if="isInEditMode">
    <button @click="isInEditMode = false">zurück</button>
    {{user}}
  </div>
  <div v-else>
    <div id="user-area">
      <span id="user">{{user.displayName || user.email}}</span>
      <button class="success" @click="isInEditMode = true">
        <font-awesome-icon icon="edit"/>
      </button>
    </div>
    <div id="user-markets">
      <div class="market">
        <market-preview :market="market"/>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase/app";
import MarketPreview from "@/components/MarketPreview";

export default {
  name: "Me",
  components: { MarketPreview },
  data() {
    return {
      user: null,
      isInEditMode: false
    };
  },
  mounted() {
    this.user = firebase.auth().currentUser;
  }
};
</script>
<style type="text/css" scoped>
  #user-area{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 18px;
  }
  #user-area #user{
    font-size: 1.2em;
    font-weight: bold;
  }
</style>