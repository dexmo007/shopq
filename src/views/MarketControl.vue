<template>
  <div>
    <router-link
      to="./"
      tag="h1"
    >{{shop && shop.placeDetails ? shop.placeDetails.name : '...'}}</router-link>
    <router-link
      to="./einlass"
      tag="button"
      style="margin: 0 auto;"
    >Einlass-Zähler</router-link>
    <h3>Stammdaten</h3>
    <div v-if="form">
      <form @submit.prevent="saveForm">
        <label>Kapazität: <input
            type="text"
            v-model="form.capacity"
          ><span class="default-value">{{defaultShopParams.capacity}}</span></label>
        <label>
          Max. Einkaufszeit pro Besucher:
          <input
            type="text"
            v-model="form.maxShoppingTime"
          ><span class="default-value">{{defaultShopParams.maxShoppingTime}}</span>
        </label>
        <label>
          Erwartete Analog-Rate:
          <input
            type="text"
            v-model="form.analogRatio"
          ><span class="default-value">{{defaultShopParams.analogRatio}}</span>
        </label>
        <label>Zusatzinfo:
          <textarea
            v-model="form.additionalInfo"
            name=""
            id=""
            cols="30"
            rows="10"
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
          opening_hours: {
            periods: details.opening_hours.periods,
            weekday_text: details.opening_hours.weekday_text
          },
          photos: details.photos.map(p => ({
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
  margin: 15px auto;
  text-align: left;
  width: 480px;
  max-width: 100%;
}
form button {
  margin: 15px auto;
  width: 480px;
  max-width: 100%;
}
form input,
form textarea {
  margin: 4px 0;
  border: 1px solid #2c3e50;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  outline: none;
}
form input:focus,
form textarea:focus {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
  border-color: #64c7a6;
}
form label .default-value {
  color: gray;
  font-style: italic;
  font-size: 0.9em;
}
form label .default-value::before {
  content: " (Standard: ";
}
form label .default-value::after {
  content: ")";
}
</style>
