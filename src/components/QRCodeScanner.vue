<template>
  <QrcodeStream
    v-on="$listeners"
    v-bind="$attrs"
  />
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";

export default {
  name: "QRCodeScanner",
  components: { QrcodeStream }
};
</script>
