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
    <slot>
      <div class="suggestion-realtime-empty" />
    </slot>
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
  border: 1px solid rgba(33, 33, 33, 0.4);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
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

.q-free .suggestion-q-text {
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 5px rgba(100, 199, 166, 0.8);
}
.suggestion:hover .q-free .suggestion-q-text {
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
  background: white;
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
  background: white;
  z-index: 2;
}

.suggestion-q-text {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
