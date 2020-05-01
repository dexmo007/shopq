<template>
  <div v-if="isInEditMode">
    <button @click="isInEditMode = false">zurück</button>
    <!-- {{user}} -->
    <form>
      <label>E-Mail Adresse:
        <input
          type="text"
          v-model="user.email"
          placeholder="email"
        /><span class="default-value">XXX</span></label>

      <label>Passwort ändern:
        <input
          type="text"
          v-model="user.password"
          placeholder="neues Passwort"
        /><span class="default-value">XXX</span></label>

      <label>Änderungen mit altem Passwort bestätigen:
        <input
          type="password"
          v-model="user.password"
          placeholder="altes Passwort"
        /><span class="default-value">XXX</span></label>
      <button type="submit">Änderungen speichern</button>
    </form>
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
    <div
      id="user-markets"
      v-if="userMarkets"
    >
      <div
        class="market"
        v-for="market in userMarkets"
        :key="market.id"
      >
        <market-preview :market="market.placeDetails">
          <div class="market-interaction">
            <router-link
              v-if="market.admin"
              :to="`/markt/${market.id}/control`"
              tag="button"
              class="success"
            >Admin</router-link>
            <router-link
              :to="`/markt/${market.id}/einlass`"
              tag="button"
              class="info"
            >Einlass</router-link>
          </div>
        </market-preview>
      </div>
    </div>
    <div v-else>

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
      userInfo: null,
      shopsLoading: false,
      shops: null
    };
  },
  computed: {
    userMarkets() {
      if (![this.userInfo, this.shops].every(s => !!s)) {
        return;
      }
      return this.shops.map(shop => ({
        ...shop,
        admin: (this.userInfo.administeredShops || []).includes(shop.id)
      }));
    }
  },
  watch: {
    async userInfo(userInfo) {
      const shopIds = [
        ...new Set([
          ...(userInfo.administeredShops || []),
          ...(userInfo.admittance || [])
        ])
      ];
      if (shopIds.length === 0) {
        this.$unbind("shops");
      } else {
        // todo batches for more than 10 shops
        await this.$bind(
          "shops",
          firebase
            .firestore()
            .collection("shops")
            .where(firebase.firestore.FieldPath.documentId(), "in", shopIds)
        );
      }
    }
  },
  async mounted() {
    this.user = firebase.auth().currentUser;
    this.shopsLoading = true;
    try {
      await this.$bind(
        "userInfo",
        firebase
          .firestore()
          .collection("userInfos")
          .doc(this.user.uid)
      );
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
.market-interaction {
  display: flex;
  background: #ffffff;
  border-left: 1px solid rgba(33, 33, 33, 0.4);
  border-radius: 0 4px 4px 0;
}
.market-interaction > button {
  margin: 6px;
}
</style>
