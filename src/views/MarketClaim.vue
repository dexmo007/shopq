<template>
  <div>
    <p>
      Claim this shit!
    </p>
    <button @click="claim">
      Claim
    </button>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  props: ["id"],
  methods: {
    async claim() {
      await firebase
        .firestore()
        .collection("shopControl")
        .doc(this.id)
        .set({
          admins: [firebase.auth().currentUser.uid]
        });
      this.$router.push(`/markt/${this.id}/control`);
    }
  }
};
</script>
