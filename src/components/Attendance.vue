<template>
  <div v-if="attendance">
    <h3>Einlass</h3>
    <div>
      <div class="row-center">
        <button
          :class="{filled: capacityLimitReached}"
          @click="handleChange(1)"
        >
          Kommt
          <span v-if="capacityLimitReached">(Laden voll!)</span>
        </button>
        <button
          @click="handleChange(-1)"
          :disabled="attendance.count === 0"
        >Geht</button>
      </div>
      <div class="row-center">
        <span>Im Laden: {{attendance.count}}</span>
      </div>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import firebase from "firebase/app";

const db = firebase.firestore();

export default {
  name: "Attendance",
  props: ["id", "shop"],
  data() {
    return {
      attendance: null
    };
  },
  async mounted() {
    const a = await this.$bind(
      "attendance",
      db.collection("attendances").doc(this.id)
    );
    if (!a) {
      db.collection("attendances")
        .doc(this.id)
        .set({
          count: 0
        });
    }
  },
  computed: {
    capacityLimitReached() {
      return this.attendance.count >= this.shop.capacity;
    }
  },
  methods: {
    handleChange(c) {
      db.collection("attendances")
        .doc(this.id)
        .set(
          {
            count: firebase.firestore.FieldValue.increment(c)
          },
          { merge: true }
        );
    }
  }
};
</script>

<style scoped>
.row-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.filled {
  background-color: darkorange;
}
</style>
