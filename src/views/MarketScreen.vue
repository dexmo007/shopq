<template>
  <div id="screen">
    <Queue
      id="q"
      :last-entry="!latestAdmission?null:{word: latestAdmission.ticketCode,
        ts: latestAdmission.timestamp}"
      :qList="queue"
    />
    <div id="info">
      <div id="info-market">
        <span id="info-market-name">{{"Rewe"}}</span>
        <span id="info-market-addr">{{"Alte Straße 2"}}</span>
      </div>
      <div id="info-market-text">
        Nur mit Einkaufswagen
      </div>
      <div id="info-general">
        Bitte halten Sie sich an die Hygiene-Richtlinien :)
      </div>
    </div>
  </div>
</template>

<script>
import Queue from "@/components/Queue";
import firebase from "firebase";

const db = firebase.firestore();
export default {
  name: "MarketScreen.vue",
  components: { Queue },
  props: {
    id: String
  },
  data() {
    return {
      queue: [],
      latestAdmissions: null
    };
  },
  computed: {
    queueRef() {
      return db.collection("queues").doc(this.id);
    },
    latestAdmission() {
      if (!this.latestAdmissions || this.latestAdmissions.length === 0) {
        return null;
      }
      return {
        ...this.latestAdmissions[0],
        timestamp: this.latestAdmissions[0].timestamp.toDate()
      };
    }
  },
  mounted() {
    this.$bind(
      "queue",
      this.queueRef.collection("users").orderBy("joinedAt", "asc")
    );
    this.$bind(
      "latestAdmissions",
      db
        .collection("ticketAdmission")
        .where("shopId", "==", this.id)
        .orderBy("timestamp", "desc")
        .limit(1)
    );
  }
};
</script>

<style>
#nav-account-area {
  display: none;
}
#nav {
  margin-top: 0;
}
#scrollable {
  margin-top: 80px;
  padding-top: 40px;
}
#app,
#nav {
  max-width: 90vw;
}
#screen {
  display: flex;
  flex-wrap: wrap;
}
#q {
  flex: 1 1 61.8%;
}
#info {
  display: flex;
  flex-direction: column;
  flex: 1 1 38.2%;
  margin-bottom: 12px; /* to match same bottom height with q */
}
#info-market {
  margin: 12px;
  padding: 12px;
  height: 120px;
  font-size: 2.8em;
  display: flex;
  flex-direction: column;
}
#info-market-name {
  font-size: 1.2em;
  font-weight: bold;
}
#info-general,
#info-market-text {
  border: 5px solid var(--border-color);
  padding: 12px;
  margin: 12px;
  flex: 1;
  min-height: 180px;
}
</style>
