<template>
  <div id="app">
    <div id="nav">
      <router-link
        to="/"
        tag="span"
        id="home-link"
      >shop<span style="color: #64c7a6;">Q</span></router-link>
      <div id="nav-account-area">
        <span v-if="user">
          {{user.isAnonymous ? 'Gast' : (user.displayName || user.email)}}
        </span>
        <router-link
          v-if="!user || user.isAnonymous"
          tag="button"
          to="/login"
        >Login</router-link>
        <button
          v-else
          class="danger"
        >Logout</button>
      </div>
    </div>

    <router-view v-if="user" />
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
      user: null
    };
  },
  async mounted() {
    this.user = await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user, error) => {
        if (error) {
          reject(error);
          return;
        }
        if (user) {
          resolve(user);
          return;
        }
        firebase
          .auth()
          .signInAnonymously()
          .then(resolve)
          .catch(reject);
      });
    });
  }
};
</script>

<style>
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: #373737;
  color: #2c3e50;
  margin: 0;
}
#nav {
  width: calc(100% + 16px);
  position: relative;
  z-index: 1;
  padding: 12px 0 18px;
  margin: 50px 0 50px -8px;
  background: #2c3e50;
  filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.42));
}
#nav::before {
  content: "";
  position: absolute;
  background: #2c3e50;
  z-index: -1;
  top: -42px;
  left: 0;
  width: 100%;
  height: calc(100% + 84px);
  clip-path: polygon(0% 0%, 100% 42px, 100% 100%, 0% calc(100% - 42px));
}
#home-link {
  font-size: 3em;
  font-weight: bolder;
  cursor: pointer;
  border-bottom: 16px;
  float: none;
  padding: 12px 18px;
  border-radius: 8px;
  color: white;
}
#app {
  border-radius: 0 0 8px 8px;
  background: white;
  margin: 8px;
}
#nav-account-area {
  float: right;
  display: flex;
  align-items: center;
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
  transition: box-shadow 280ms cubic-bezier(0.43, 0, 0.37, 0.94),
    background-color 140ms cubic-bezier(0.43, 0, 0.37, 0.94);
  color: #2c3e50;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
}
button[type="submit"],
button.success {
  border: 1px solid rgba(33, 33, 33, 0.4);
  background-color: #64c7a6;
}
button[type="submit"],
button.danger {
  border: 1px solid rgba(136, 32, 34, 0.75);
  background-color: #fb6b6f;
}
button:hover {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
}
.toasted > svg:first-child {
  margin-right: 0.7rem;
}
</style>
