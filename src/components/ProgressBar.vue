<template>
  <div id="progress">
    <div id="limit-wrapper">
      <span :style="{flex: !isOverflow ? 1 : threshold/overflowCapacity}" />
      <span id="limit">{{threshold}}</span>
      <span :style="{flex: !isOverflow ? 0 : 1-(threshold/overflowCapacity)}" />
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
        >{{isOverflow ? '' : count}}</div>
      </div>
      <div
        id="progressbar-overflow"
        v-if="isOverflow"
        :style="{flex: 1 - (threshold / overflowCapacity)}"
      >
        <div
          id="over-limit"
          :style="{flex: (count-threshold)/(overflowCapacity-threshold)}"
        >
          {{count}}
        </div>
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
      return this.count * 1.01;
    },
    underLimitWidth() {
      return this.isOverflow
        ? "100%"
        : (this.count / this.threshold) * 100 + "%";
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
  border-width: 1px;
  flex: 1;
  overflow: hidden;
  border-radius: 4px 0 0 4px;
}
#progressbar.alone {
  border-radius: 5px;
}
#progressbar-overflow {
  border-style: dotted;
  border-width: 1px 0 1px 0;
  border-radius: 0;
  display: flex;
}
#under-limit {
  background-color: var(--success-color);
  height: 30px;
  line-height: 30px;
}
#over-limit {
  background-color: var(--danger-color);
  height: 30px;
  line-height: 30px;
}
#limit-wrapper {
  display: flex;
}
</style>
