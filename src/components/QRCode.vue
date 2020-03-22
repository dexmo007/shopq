<template>
  <canvas
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
    console.log(this.text);
    QRCode.toCanvas(this.$refs.canvas, this.text, function(error) {
      if (error) console.error(error);
      console.log("success!");
    });
  }
};
</script>
