<template>
  <canvas
    style="width: 280px; height: 280px;"
    v-bind="$attrs"
    v-on="$listeners"
    ref="canvas"
  >

  </canvas>
</template>
<script>
import QRCode from "qrcode";

export default {
  name: "QRCode",
  props: ["text"],
  mounted() {
    QRCode.toCanvas(this.$refs.canvas, this.text, { width: 260 }, function(
      error
    ) {
      if (error) console.error(error);
    });
  }
};
</script>
