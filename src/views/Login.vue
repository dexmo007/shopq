<template>
  <div id="firebaseui-auth-container"></div>
</template>
<script>
import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "login",
  data() {
    return {
      ui: null
    };
  },
  mounted() {
    const redirectPath = this.$route.query.redirect
      ? this.$route.query.redirect
      : "/me";
    const forceNonAnon = !!this.$route.query.strict;
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    this.ui.start("#firebaseui-auth-container", {
      signInSuccessUrl: redirectPath,
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false
        },
        ...(forceNonAnon
          ? []
          : [firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID])
      ]
    });
  },
  beforeDestroy() {
    if (this.ui) {
      this.ui.delete();
    }
  }
};
</script>
