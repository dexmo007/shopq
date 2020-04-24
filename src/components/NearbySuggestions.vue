<template>
  <div id="nearby">
    <h1>{{title}}</h1>
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
      />
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
import { nearbySearch, geocode } from "@/api/google-maps";
import MarketPreview from "@/components/MarketPreview";

export default {
  name: "NearbySuggestions",
  props: {
    title: {
      type: String,
      default: "In der Nähe"
    }
  },
  components: { MarketPreview },
  data() {
    return {
      suggestions: null,
      status: "searching",
      postalCode: ""
    };
  },
  methods: {
    async submitPostalCode() {
      if (!this.postalCode.trim()) {
        return;
      }
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
      this.suggestions = await nearbySearch({ lat, lng });
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
  animation-duration: 0.6s;
  animation-iteration-count: infinite;
}

.dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.dots span:nth-child(3) {
  animation-delay: 0.4s;
}

#geo-error {
  font-size: 1.4em;
  font-weight: bold;
  max-width: 470px;
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
</style>
