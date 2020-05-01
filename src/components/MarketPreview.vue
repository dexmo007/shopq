<template>
  <router-link
    :to="'markt/' + market.place_id"
    tag="div"
    class="suggestion"
    :style="{backgroundColor: market.color}"
  >
    <div class="suggestion-info">
      <span class="suggestion-name">{{market.name}}</span>
      <span class="suggestion-addr">{{market.vicinity}}</span>
    </div>
    <slot
            v-if="!market.shopQ"
    >
      <div class="suggestion-realtime-empty" />
    </slot>
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
  </router-link>
</template>

<script>
export default {
  name: "MarketPreview.vue",
  props: {
    market: {
      type: Object,
      default() {
        return {
          name: "Ups",
          vicinity: "..."
        };
      }
    }
  }
};
</script>

<style scoped>
.suggestion {
  margin: 14px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  font-size: 1rem;
  font-weight: normal;
}

.suggestion-info,
.suggestion-q-text,
.suggestion-q-counter {
  transition: all 200ms cubic-bezier(0.43, 0, 0.37, 0.94);
}

.suggestion-info {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
.suggestion:hover .suggestion-info {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}

.q-free {
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 5px rgba(100, 199, 166, 0.8);
}
.suggestion:hover .q-free {
  box-shadow: 0 0 12px rgba(100, 199, 166, 1);
}

.suggestion-q-counter {
  z-index: 1;
  box-shadow: 0 0 5px rgba(43, 62, 80, 0.2);
}
.suggestion:hover .suggestion-q-counter {
  box-shadow: 0 0 12px rgba(43, 62, 80, 0.4);
}

.suggestion-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
  text-align: initial;
  background: var(--background-contrast);
  z-index: 1;
  flex: 1;
  border-radius: 4px 0 0 4px;
}

.suggestion-name {
  font-size: 1.2em;
  font-weight: bold;
}
.suggestion-addr {
  font-size: 1em;
}
/* this is needed, to get all 4 corners smooth */
.suggestion-realtime-empty {
  border-radius: 0 4px 4px 0;
  width: 4px;
  background: var(--background-contrast);
  z-index: 2;
}
.suggestion-info + *{
  border-radius: 0 4px 4px 0;
  background: var(--background-contrast);
}
.suggestion-name {
  font-size: 1.2em;
  font-weight: bold;
}
.suggestion-addr {
  font-size: 1em;
}
.suggestion-realtime.q-free {
  background-color: rgb(100, 199, 166);
}
.suggestion-realtime {
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  border-radius: 0 4px 4px 0;
  margin-top: -1px;
  margin-bottom: -1px;
  margin-right: -1px;
  color: black;
}
.suggestion-realtime.q-free {
  background-color: var(--success-color);
}

.suggestion-q-counter {
  font-size: 2em;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: var(--accent-color);
  color: var(--text-bright-color);
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
