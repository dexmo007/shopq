<template>
  <div>
    <div id="app">
      <div id="fixed">
        <div id="nav-account-area">
          <router-link
            v-if="!user || user.isAnonymous"
            tag="button"
            to="/login?strict=true"
            class="success"
          >Login</router-link>
          <template v-else>
            <button
              class="danger"
              @click="logout"
            >Logout</button>
            <router-link
              to="/me"
              tag="span"
            >{{user.displayName || user.email}}</router-link>

          </template>

        </div>
        <div id="nav">
          <router-link
            to="/"
            tag="span"
            id="home-link"
          >shop<span style="color: var(--primary-color);">Q</span></router-link>
          <router-link
            to="/about"
            tag="span"
            id="about-link"
          >
            <font-awesome-icon icon="question"></font-awesome-icon>
          </router-link>
        </div>
      </div>
      <div id="scrollable">
        <router-view v-if="user" />
        <div v-else>
          Loading...
        </div>
      </div>
    </div>
    <router-link
      to="/impressum"
      id="impressum-link"
      tag="div"
    >Impressum</router-link>
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
  methods: {
    async logout() {
      await firebase.auth().signOut();
      this.user = await firebase.auth().signInAnonymously();
    }
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
  @import 'variables.css';
body {
  width: 100%;
  margin: 0;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: var(--background-color);
  color: var(--text-color);
  overflow-x: hidden;
}
#fixed > #nav-account-area,
#app {
  width: calc(100% - 32px);
  max-width: 720px;
  margin: 8px auto;
}

#fixed {
  position: fixed;
  margin-top: 0;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: var(--background-color);
}
#nav-account-area {
  color: var(--text-bright-color);
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}
#nav-account-area > * {
  margin-left: 8px;
}
#nav {
  width: calc(100%);
  max-width: 752px; /* 720px + 32px */
  position: relative;
  z-index: 1;
  padding: 12px 0 18px;
  margin: 20px auto 0;
  background: var(--accent-color);
  filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.42));
}
#nav::before {
  content: "";
  position: absolute;
  width: 100%;
  height: calc(100% + 56px);
  background: var(--accent-color);
  z-index: -1;
  top: -28px;
  left: 0;
  clip-path: polygon(0% 0%, 100% 28px, 100% 100%, 0% calc(100% - 28px));
}
#home-link {
  font-size: 3em;
  font-weight: bolder;
  cursor: pointer;
  border-bottom: 16px;
  float: none;
  border-radius: 8px;
  color: var(--text-bright-color);
  text-shadow: 0 0 4px rgb(0, 0, 0);
}
#about-link {
  display: inline-flex;
  color: var(--text-color);
  font-size: 0.6em;
  padding: 0.5em 0.6em;
  vertical-align: top;
  height: 0.8rem;
  width: 0.8rem;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  background: var(--text-bright-color);
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: box-shadow 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
}
#about-link:hover {
  box-shadow: 0 0 3px var(--text-bright-color);
}

#scrollable {
  border-radius: 0 0 8px 8px;
  background: var(--background-contrast);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.42);
  margin-top: 100px;
  padding-top: 80px;
}

input:not(.blank),
textarea:not(.blank) {
  margin: 4px 0;
  border: 1px solid #2c3e50;
  background: var(--input-background);
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  outline: none;
}
input:focus:not(.blank),
textarea:focus:not(.blank) {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
  border-color: var(--primary-color);
}
button {
  display: inline-block;
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
  color: var(--text-color);
  background: var(--light-background);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  /* prevents double-tap to zoom action */
  touch-action: manipulation;
}
button[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
button[type="submit"],
button.success {
  border: 1px solid var(--border-color);
  background-color: var(--success-color);
}
button.danger {
  border: 1px solid rgba(136, 32, 34, 0.75);
  background-color: var(--danger-color);
}
button.info {
  background-color: var(--warning-color);
}
button:hover {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
}
form {
  display: flex;
  flex-direction: column;
}
form p {
  text-align: initial;
  margin: 0;
}
form section {
  margin: 18px 10px;
  display: flex;
  flex-direction: column;
}
form label {
  display: flex;
  flex-direction: column;
  margin: 15px 8px;
  text-align: left;
}
form button {
  margin: 15px 8px;
}
form label .default-value {
  color: gray;
  font-style: italic;
  font-size: 0.9em;
}
form label .default-value::before {
  content: "(";
}
form label .default-value::after {
  content: ")";
}

#impressum-link {
  display: inline-block;
  cursor: pointer;
  color: var(--text-bright-color);
  margin: 18px;
}
#impressum-link:hover {
  text-decoration: underline;
}
</style>
