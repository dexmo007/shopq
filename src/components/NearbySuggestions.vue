<template>
  <div id="nearby">
    <h1 v-if="mode === 'USER_LOCATION'">In der Nähe</h1>
    <h1 v-else-if="mode === 'POSTAL_CODE'">Geschäfte in {{postalCode}}</h1>
    <div
      v-if="status === 'searching'"
      id="searching"
    >
      Wir suchen nach Geschäften, die du brauchen könntest<span class="dots"><span>.</span><span>.</span><span>.</span></span><br />
      <span class="emoji">&#129299;</span>
    </div>
    <div
      id="suggestions-wrapper"
      v-if="status === 'found-suggestions'"
    >
      <market-preview
        class="suggestion"
        v-for="market in suggestions"
        :key="market.id"
        :market="market"
      >
        <div
          class="suggestion-realtime-empty"
          v-if="!market.shopQ"
        />
        <div
          class="suggestion-realtime q-free"
          v-else-if="!market.shopQ.queueCounter"
        >
          <div class="suggestion-q-text">Keine<br />Schlange!</div>
        </div>
        <div
          class="suggestion-realtime"
          v-else
        >
          <div class="suggestion-q-counter">
            {{market.shopQ.queueCounter}}
          </div>
          <div class="suggestion-q-text">Personen in<br /> der Schlange</div>
        </div>
      </market-preview>
    </div>

    <div
      v-if="status === 'location-failed'"
      id="geo-error"
    >
      <span class="emoji">&#127755;</span><br />
      <p>
        <span style="color: #dd363a;">Chaos pur!</span> Wir konnten keine Geschäfte für dich finden,
        aber mit etwas Glück hilft dir diese Suche:
      </p>
    </div>
    <div v-if="status === 'location-disabled' || status === 'location-failed'">
      <form @submit.prevent="submitPostalCode">
        <label>
          PLZ eingeben:
          <input
            placeholder="PLZ"
            v-model="postalCode"
          />
        </label>
        <button
          type="submit"
          :disabled="!this.postalCode.trim()"
        >Zeige Läden</button>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { nearbySearch, geocode } from "@/api/google-maps";
import MarketPreview from "@/components/MarketPreview";

export default {
  name: "NearbySuggestions",
  components: { MarketPreview },
  data() {
    return {
      suggestionResults: null,
      status: "searching",
      mode: "USER_LOCATION",
      postalCode: "",
      realtimeInfos1: null,
      realtimeInfos2: null
    };
  },
  computed: {
    realtimeInfos() {
      return [...(this.realtimeInfos1 || []), ...(this.realtimeInfos2 || [])];
    },
    suggestions() {
      if (!this.suggestionResults) {
        return null;
      }
      return this.suggestionResults.map(market => ({
        ...market,
        shopQ: (this.realtimeInfos || []).find(
          ({ id }) => id == market.place_id
        )
      }));
    }
  },
  methods: {
    async submitPostalCode() {
      if (!this.postalCode.trim()) {
        return;
      }
      this.mode = "POSTAL_CODE";
      const result = await geocode({
        componentRestrictions: {
          country: "DE",
          postalCode: this.postalCode.trim()
        }
      });
      // TODO ERROR not found
      this.fetchNearbySuggestions({
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng()
      });
    },
    async fetchNearbySuggestions({ lat, lng }) {
      this.suggestionResults = await nearbySearch({ lat, lng });

      const ids = this.suggestionResults.map(p => p.place_id);
      await this.$bind(
        "realtimeInfos1",
        firebase
          .firestore()
          .collection("shops")
          .where(
            firebase.firestore.FieldPath.documentId(),
            "in",
            ids.slice(0, 10)
          )
      );
      if (ids.length > 10) {
        await this.$bind(
          "realtimeInfos2",
          firebase
            .firestore()
            .collection("shops")
            .where(
              firebase.firestore.FieldPath.documentId(),
              "in",
              ids.slice(10)
            )
        );
      }
      setTimeout(() => {
        this.status = "found-suggestions";
      }, Math.floor(Math.random() * (1800 - 900 + 1)) + 900);
    }
  },
  mounted() {
    navigator.geolocation.getCurrentPosition(
      async position => {
        this.fetchNearbySuggestions({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      GeolocationPositionError => {
        if (GeolocationPositionError.code === 2) {
          setTimeout(() => {
            this.status = "location-failed";
          }, Math.floor(Math.random() * (3400 - 1600 + 1)) + 1600);
        } else {
          this.status = "location-disabled";
        }
      }
    );
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#searching {
  font-size: 1.4em;
  font-weight: bold;
  padding: 32px;
  max-width: 320px;
  margin: auto;
}
#searching > .emoji {
  font-weight: normal;
  font-size: 4em;
  padding: 6px;
}

@keyframes color {
  from {
    color: initial;
  }

  50% {
    color: rgb(100, 199, 166);
    text-shadow: 0 0 2px rgb(100, 199, 166);
  }

  to {
    color: initial;
  }
}

.dots span {
  animation-name: color;
  animation-duration: 0.9s;
  animation-iteration-count: infinite;
}

.dots span:nth-child(2) {
  animation-delay: 0.3s;
}

.dots span:nth-child(3) {
  animation-delay: 0.6s;
}

#geo-error {
  font-size: 1.4em;
  font-weight: bold;
  max-width: 320px;
  margin: -40px auto 0;
}
#geo-error > .emoji {
  font-weight: normal;
  font-size: 4em;
  padding: 6px;
}
#geo-error > p {
  margin: -10px 12px 5px;
  text-align: justify;
}

#suggestions-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  max-width: 480px;
  margin: 0 auto;
}
.suggestion {
  width: 100%;
}

/* this is needed, to get all 4 corners smooth */
.suggestion-realtime-empty {
  border-radius: 0 4px 4px 0;
  width: 4px;
  background: white;
  z-index: 2;
}
.suggestion-realtime {
  border: 1px solid rgba(33, 33, 33, 0.4);
  display: flex;
  justify-content: center;
  border-radius: 0 4px 4px 0;
  margin-top: -1px;
  margin-bottom: -1px;
  margin-right: -1px;
}
.suggestion-realtime.q-free {
  background-color: rgb(100, 199, 166);
}

.suggestion-q-counter {
  font-size: 2em;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: #2b3e50;
  color: white;
  margin: -1px;
  border: 1px solid rgba(0, 0, 0, 0.4);
}
</style>
