<template>
  <div>
    <div id="user-area">
      {{user}}
    </div>
    <div id="user-markets">
      <div class="market">
        <router-link tag="a" to="/market/XXX"><b>Rewe</b>, Bissingzeile 4</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase/app";

export default {
  data() {
    return {
      user: null
    };
  },
  mounted() {
    this.user = firebase.auth().currentUser;
  }
};
</script>
