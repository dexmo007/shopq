<template>
  <video
    v-on="$listeners"
    v-bind="$attrs"
    autoplay
    ref="qrscan"
  ></video>
</template>

<script>
// import Instascan from "instascan";
import QrScanner from "qr-scanner";

// import QrScannerWorkerPath from "!!file-loader!./node_modules/qr-scanner/qr-scanner-worker.min.js";

QrScanner.WORKER_PATH = "./assets/qr-scanner-worker.min.js";

export default {
  data() {
    return { stream: null };
  },
  mounted() {
    // new QrScanner(this.$refs.qrscan, result =>
    //   console.log("decoded qr code:", result)
    // );
    const constraints = {
      video: true
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      this.$refs.qrscan.srcObject = stream;
      this.stream = stream;
    });
  },
  // mounted() {
  //   let scanner = new Instascan.Scanner({
  //     video: this.$refs.qrscan,
  //     continuous: true
  //   });
  //   scanner.addListener("scan", function(content) {
  //     console.log(content);
  //   });
  //   Instascan.Camera.getCameras()
  //     .then(function(cameras) {
  //       if (cameras.length > 0) {
  //         scanner.start(cameras[0]);
  //       } else {
  //         console.error("No cameras found.");
  //       }
  //     })
  //     .catch(function(e) {
  //       console.error(e);
  //     });
  // }
  beforeDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
  }
};
</script>
