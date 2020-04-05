<template>
  <div>
    {{user}}
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
