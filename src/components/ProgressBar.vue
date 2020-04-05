<template>
  <div id="progress">
    <div id="limit-wrapper">
      <span :style="{width: underLimitWidth}" />
      <span id="limit">{{threshold}}</span>
      <span :style="{width: overLimitWidth}" />
    </div>

    <div id="progressbar-wrapper">
      <div
        id="progressbar"
        :class="{alone: !isOverflow}"
        :style="{flex: !isOverflow ? 1 : (threshold / overflowCapacity)}"
      >
        <div
          id="under-limit"
          :style="{width: underLimitWidth}"
        >{{this.count}}</div>
      </div>
      <div
        id="progressbar-overflow"
        v-if="isOverflow"
        :style="{flex: 1 - (threshold / overflowCapacity)}"
      >
        <div
          id="over-limit"
          :style="{flex: (count-threshold)/(overflowCapacity-threshold)}"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar.vue",
  props: {
    threshold: {
      type: Number,
      default: 20
    },
    count: {
      type: Number
    }
  },
  computed: {
    isOverflow() {
      return this.count > this.threshold;
    },
    overflowCapacity() {
      return this.count * 1.1;
    },
    underLimitWidth() {
      return this.isOverflow
        ? "100%"
        : (this.count / this.threshold) * 100 + "%";
    },
    overLimitWidth() {
      return !this.isOverflow
        ? "0%"
        : (this.count - this.threshold) * 12 + "px";
    }
  }
};
</script>

<style scoped>
#progress {
  width: 100%;
}
#progressbar-wrapper {
  width: 100%;
  height: 32px;
  display: flex;
}
#progressbar {
  border-style: solid;
  border-width: 1px 0 1px 1px;
  flex: 1;
  overflow: hidden;
  border-radius: 4px 0 0 4px;
}
#progressbar.alone {
  border-radius: 5px;
  border-width: 1px;
}
#progressbar-overflow {
  border-style: dotted;
  border-width: 1px 1px 1px 0;
  border-radius: 0 4px 4px 0;
  display: flex;
}
#under-limit {
  background-color: #64c7a6;
  height: 30px;
}
#over-limit {
  background-color: #fb6b6f;
  height: 30px;
  width: 100%;
}
</style>
