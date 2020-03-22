<template>
  <div>
    <h3>Stammdaten</h3>
    <div v-if="form">
      <form @submit.prevent="saveForm">
        <label>Kapazität: <input
            type="text"
            v-model="form.capacity"
          ><span class="default-value">{{defaultShopParams.capacity}}</span></label>
        <label>Max. Einkaufszeit pro Besucher: <input
            type="text"
            v-model="form.maxShoppingTime"
          ><span class="default-value">{{defaultShopParams.maxShoppingTime}}</span></label>
        <label>Erwartete Analog-Rate: <input
            type="text"
            v-model="form.analogRatio"
          ><span class="default-value">{{defaultShopParams.analogRatio}}</span></label>
        <label>Zusatzinfo: <textarea
            v-model="form.additionalInfo"
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea></label>
        <div>
          <input
            type="submit"
            value="Aktualisieren"
            :disabled="!formChanged"
          >
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import deepEqual from "deepequal";

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
    const shop = await this.$bind("shop", this.shopRef);
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
form label .default-value {
  color: gray;
  font-style: italic;
  font-size: 0.9em;
}
form label .default-value::before {
  content: "(Standard: ";
}
form label .default-value::after {
  content: ")";
}
</style>
