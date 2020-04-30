<template>
  <div id="nearby">
    <h1 v-if="mode === 'USER_LOCATION'">In der Nähe</h1>
    <h1 v-else-if="mode === 'POSTAL_CODE'">Geschäfte in {{postalCode}}</h1>
    <div
      v-if="status === 'searching'"
      id="searching"
    >
      Suche nach Vorschlägen<br />
      <div id="lookin-for-markets">
        <market-preview
                class="suggestion"
                :market="{name: loading.randomName, vicinity: loading.randomVicinity}"
        >
          <div
                  class="suggestion-realtime q-free"
                  v-if="loading.randomRealTimeInfo === 1"
          >
            <div class="suggestion-q-text">Keine<br />Schlange!</div>
          </div>
          <div
                  class="suggestion-realtime"
                  v-else-if="loading.randomRealTimeInfo === 2"
          >
            <div class="suggestion-q-counter">
              2
            </div>
            <div class="suggestion-q-text">Personen in<br /> der Schlange</div>
          </div>
        </market-preview>
        <span class="emoji">&#128269;</span>
      </div>
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
          <div class="suggestion-q-text">{{market.shopQ.queueCounter === 1 ? 'Person' : 'Personen'}} in<br /> der Schlange</div>
        </div>
      </market-preview>
    </div>

    <div
      v-if="status === 'location-failed'"
      id="geo-error"
    >
      <p>
        &#127755;<span style="color: #dd363a;">Chaos pur!</span> Wir konnten keine Geschäfte für dich finden,
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
      loading: {
        randomName: "",
        randomVicinity: "",
        randomRealTimeInfo: 0
      },
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
    changeRandomText(){
      const randomNameTexts = ["Trödelladen", "Dein Supermarkt", "Museum"];
      const randomVicinityTexts = ["52° 30' 52.310\" N 13° 21' 0.302\" E ", "nebenan", "um die Ecke", "in der Nachbarschaft"];
      this.loading.randomName = randomNameTexts[Math.floor(Math.random() * randomNameTexts.length)];
      this.loading.randomVicinity = randomVicinityTexts[Math.floor(Math.random() * randomVicinityTexts.length)];
      this.loading.randomRealTimeInfo = (Math.random() * 4 ) << 0; //random int between 0 and 3
    },
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
    this.changeRandomText();
    this.$nextTick(function () {
      window.setInterval(() => {
        this.changeRandomText();
      },6300);
    });
    navigator.geolocation.getCurrentPosition(
      async position => {
        this.fetchNearbySuggestions({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      GeolocationPositionError => {
        if (GeolocationPositionError.code === 1) {
          this.status = "location-disabled";
        } else {
          // wait a random time before showing the failed screen to indicate "working" server
          setTimeout(() => {
            this.status = "location-failed";
          }, Math.floor(Math.random() * (3400 - 1600 + 1)) + 1600);
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
  max-width: 480px;
  margin: auto;
}
#lookin-for-markets {
   position: relative;
 }
#lookin-for-markets > .emoji {
  font-weight: normal;
  font-size: 4em;
  position: absolute;
  z-index: 2;
  top: 2px;
  left: 40%;
  animation-name: moveMag;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(0.43, 0, 0.37, 0.94);
}
@keyframes moveMag {
  from { transform: rotate(0deg) translateX(18px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(18px) rotate(-360deg); }
}
 /* @keyframes moveMag {
  from {
    top: -42px;
    left: 0;
  }
  20%{
    top: -2px;
    left: 20%;
  }
  30%{
    top: 4%;
    left: 15%;
  }
  50%{
    top: -2px;
    left: 24%;
  }

  50%{
    top: -20px;
    left: 64%;
  }
  to {
    top: -42px;
    left: 0;
  }

} */


#geo-error {
  font-size: 1.4em;
  font-weight: bold;
  max-width: 320px;
  margin: -40px auto 0;
}
#geo-error > p {
  margin: -10px 12px 5px;
  text-align: justify;
}

#suggestions-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  max-width: 480px;
  margin: 0 auto;
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
  color: black;
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
.suggestion-q-text {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
