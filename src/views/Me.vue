<template>
  <div v-if="isInEditMode">
    <button @click="isInEditMode = false">zurück</button>
    {{user}}
    <input type="text" v-model="user.email" placeholder="email"/>
    <input type="text" v-model="user.password" placeholder="neues Passwort"/>
  </div>
  <div v-else-if="user">
    <div id="user-area">
      <span id="user">{{user.displayName || user.email}}</span>
      <button
        class="success"
        @click="isInEditMode = true"
      >
        <font-awesome-icon icon="edit" />
      </button>
    </div>
    <div id="user-markets">
      <div class="market">
        <market-preview :market="market" >
          <router-link to="/todo" tag="button" class="success">Einlass</router-link>
        </market-preview>
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
#user-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 18px;
}
#user-area #user {
  font-size: 1.2em;
  font-weight: bold;
}
#user-markets {
  padding-bottom: 6px;
}
</style>
