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
import { changed } from "@/util/object";
import { deleteIfAbsent } from "@/util/firestore";

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
    const shop = await this.$bind("shop", this.shopRef);
    if (!shop) {
      this.$router.push("/markt/" + this.id);
      return;
    }
    this.form = {
      capacity: this.shop.capacity,
      maxShoppingTime: this.shop.maxShoppingTime || null,
      additionalInfo: this.shop.additionalInfo || null
    };
    await this.$bind(
      "defaultShopParams",
      db.collection("shops").doc("default")
    );
  },
  computed: {
    shopRef() {
      return db.collection("shops").doc(this.id);
    },
    formChanged() {
      return (
        this.form.capacity !== this.shop.capacity ||
        changed(this.form.maxShoppingTime, this.shop.maxShoppingTime) ||
        changed(this.form.additionalInfo, this.shop.additionalInfo)
      );
    }
  },
  methods: {
    async saveForm() {
      try {
        this.saving = true;
        await this.shopRef.update({
          capacity: this.form.capacity,
          maxShoppingTime: deleteIfAbsent(this.form.maxShoppingTime),
          additionalInfo: deleteIfAbsent(this.form.additionalInfo)
        });
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
