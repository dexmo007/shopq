<template>
  <div id="app">
    <div id="nav">
      <router-link
        to="/"
        tag="span"
        id="home-link"
      >shop<span style="color: #64c7a6;">Q</span></router-link>
    </div>

    <router-view v-if="signedIn" />
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  data() {
    return {
      signedIn: false
    };
  },
  async mounted() {
    await firebase.auth().signInAnonymously();
    this.signedIn = true;
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#nav {
  margin: 14px;
}
#home-link {
  font-size: 3em;
  font-weight: bolder;
}
button {
  display: block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
}
</style>
