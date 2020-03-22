<template>
  <div>
    <Attendance
      :id="id"
      :shop="shop"
      v-if="shop"
    />
    <h3>Stammdaten</h3>
    <div v-if="shop && defaultShopParams && form">
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
import Attendance from "@/components/Attendance.vue";

const db = firebase.firestore();

export default {
  props: ["id"],
  components: { Attendance },
  data() {
    return {
      shop: null,
      defaultShopParams: null,
      form: null,
      saving: false
    };
  },
  firestore: {
    defaultShopParams: db.collection("shops").doc("default")
  },
  async mounted() {
    const shop = await this.$bind("shop", this.shopRef);
    this.form = JSON.parse(JSON.stringify(shop));
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
