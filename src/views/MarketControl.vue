<template>
  <div>
    <router-link
      to="./"
      tag="h1"
    >{{(shop && shop.placeDetails) ? shop.placeDetails.name : '...'}}</router-link>
    <router-link
      to="./einlass"
      tag="button"
      style="margin: 0 auto;"
    >Einlass-Zähler</router-link>
    <h3>Stammdaten</h3>
    <div v-if="form">
      <form @submit.prevent="saveForm">
        <label>Kapazität: <input
            type="number"
            v-model.number="form.capacity"
          ><span class="default-value">Stellen Sie ein, wie viele Kunden sich gleichzeitig im Geschäft aufhalten dürfen</span></label>
        <label>
          Max. Einkaufszeit pro Besucher (in Minuten):
          <input
            v-if="form.maxShoppingTime || showShoppingTimeInput"
            type="number"
            @focus="showShoppingTimeInput = true"
            @blur="showShoppingTimeInput = false"
            v-model.number="form.maxShoppingTime"
          >
          <button
            v-else
            @click="form.maxShoppingTime = defaultShopParams.maxShoppingTime"
            class="success"
          >
            Einkaufstimer aktivieren
          </button>
          <span class="default-value">Zeigt Kunden mit der App einen Timer an, wie lange Sie sich noch im Geschäft aufhalten dürfen</span>
        </label>
        <label>Zusatzinfo:
          <textarea
                  v-model="form.additionalInfo"
                  cols="30"
                  rows="10"
                  placeholder="z.B.: Einlass nur mit Wagen!"
          />
          </label>
        <button
          type="submit"
          :disabled="!formChanged"
        >Stammdaten aktualisieren</button>

      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import deepEqual from "deepequal";
import { getPlaceDetails } from "@/api/places";

const db = firebase.firestore();

export default {
  props: ["id"],
  data() {
    return {
      shop: null,
      defaultShopParams: null,
      form: null,
      showShoppingTimeInput: false,
      saving: false
    };
  },
  async mounted() {
    this.defaultShopParams = await this.$bind(
      "shop",
      db.collection("shops").doc("default")
    );
    const shop = await this.initShop();
    this.form = JSON.parse(JSON.stringify(shop || {}));
  },
  computed: {
    shopRef() {
      return db.collection("shops").doc(this.id);
    },
    formChanged() {
      return !deepEqual(this.form, this.shop);
    }
  },
  methods: {
    async initShop() {
      let shop = await this.$bind("shop", this.shopRef);
      if (!shop) {
        shop = {};
      }
      if (!shop.placeDetails) {
        const details = await getPlaceDetails(this.id);

        shop.placeDetails = {
          ...details,
          geometry: {
            location: {
              lat: details.geometry.location.lat(),
              lng: details.geometry.location.lng()
            }
          },
          opening_hours: !details.opening_hours ? null : {
            periods: details.opening_hours.periods,
            weekday_text: details.opening_hours.weekday_text
          },
          photos: !details.photos
            ? null
            : details.photos.map(p => ({
                height: p.height,
                width: p.width,
                html_attributions: p.html_attributions,
                url: p.getUrl()
              }))
        };
        db.collection("shops")
          .doc(this.id)
          .set(shop, { merge: true });
      }
      return shop;
    },
    async saveForm() {
      try {
        this.saving = true;
        await this.shopRef.update(this.form);
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
form {
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
</style>
