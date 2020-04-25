<template>
  <div v-if="isInEditMode">
    <button @click="isInEditMode = false">zurück</button>
    {{user}}
    <input
      type="text"
      v-model="user.email"
      placeholder="email"
    />
    <input
      type="text"
      v-model="user.password"
      placeholder="neues Passwort"
    />
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
      <div
        class="market"
        v-for="market in userMarkets"
        :key="market.id"
      >
        <market-preview :market="market.placeDetails">
          <router-link
            v-if="administeredShops.includes(market)"
            :to="`/markt/${market.id}/control`"
            tag="button"
            class="success"
          >Admin</router-link>
          <router-link
            :to="`/markt/${market.id}/einlass`"
            tag="button"
            class="success"
          >Einlass</router-link>
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
      isInEditMode: false,
      administeredShops: null,
      admittanceShops: null,
      shopsLoading: false
    };
  },
  computed: {
    userMarkets() {
      if (![this.administeredShops, this.admittanceShops].every(s => !!s)) {
        return;
      }
      return [...this.administeredShops, ...this.admittanceShops];
    }
  },
  async mounted() {
    this.user = firebase.auth().currentUser;
    this.shopsLoading = true;
    try {
      const shopControl = firebase.firestore().collection("shopControl");
      const administeredShops = await shopControl
        .where("admins", "array-contains", this.user.uid)
        .get()
        .then(s => s.docs.map(d => d.id));
      const admittanceShops = await shopControl
        .where("admittance", "array-contains", this.user.uid)
        .get()
        .then(s => s.docs.map(d => d.id));
      // TODO batches of 10 to be safe
      const shops = await firebase
        .firestore()
        .collection("shops")
        .where(firebase.firestore.FieldPath.documentId(), "in", [
          ...administeredShops,
          ...admittanceShops
        ])
        .get()
        .then(s => s.docs);
      this.administeredShops = shops
        .filter(d => administeredShops.includes(d.id))
        .map(d => ({ id: d.id, ...d.data() }));
      this.admittanceShops = shops
        .filter(d => admittanceShops.includes(d.id))
        .map(d => ({ id: d.id, ...d.data() }));
    } finally {
      this.shopsLoading = false;
    }
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
