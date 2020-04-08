<template>
  <canvas
          height="420px"
          width="420px"
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
    QRCode.toCanvas(this.$refs.canvas, this.text, function(error) {
      if (error) console.error(error);
    });
  }
};
</script>
