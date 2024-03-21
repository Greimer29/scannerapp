<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-sticky style="z-index: 1" position="bottom-left" :offset="[18, 18]">
      <q-fab color="blue" icon="keyboard_arrow_up" direction="up">
        <q-fab-action @click="toggleTorch" color="blue" icon="flashlight_on" />
        <q-fab-action @click="zoomIn" color="blue" icon="add" />
        <q-fab-action @click="zoomOut" color="blue" icon="remove" />
        <q-fab-action @click="goBack" color="blue" icon="arrow_back" />
      </q-fab>
    </q-page-sticky>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import {
  BarcodeScanner,
  SupportedFormat,
} from "@capacitor-community/barcode-scanner";
import { useQuasar } from "quasar";
import { App } from "@capacitor/app";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ScannerPage",
  setup() {
    const $q = useQuasar();
    const zoomFactor = ref(1.0);
    const torchOn = ref(false);
    const router = useRouter();

    const stopScan = async () => {
      await BarcodeScanner.stopScan();
      await BarcodeScanner.showBackground();
      document.querySelector("body").classList.remove("scanner-active");
      router.go(-1);
    };

    const startScan = async () => {
      document.querySelector("body").classList.add("scanner-active");
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.denied) {
        // the user denied permission for good
        // redirect user to app settings if they want to grant it anyway
        const c = confirm(
          "If you want to grant permission for using your camera, enable it in the app settings."
        );
        if (c) {
          BarcodeScanner.openAppSettings();
        }
      }

      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan({
        targetedFormats: [SupportedFormat.QR_CODE],
      });
      if (result.hasContent) {
        console.log(result.content);
        alert("It works");
        $q.notify({
          message: `${result.content}`,
        });
        stopScan();
      } else {
        console.log(result.content);
        alert("Didnt works");
        $q.notify({
          message: `${result.content}`,
        });
        stopScan();
      }
    };

    const askUser = () => {
      prepare();
      const c = confirm("Do you want to scan a barcode?");
      if (c) {
        startScan();
      } else {
        stopScan();
      }
    };

    const goBack = () => {
      router.go(-1);
      BarcodeScanner.stopScan();
      BarcodeScanner.showBackground();
    };

    const toggleTorch = () => {
      torchOn.value = !torchOn.value;
    };

    const zoomIn = () => {
      zoomFactor.value = zoomFactor.value + 0.3;
    };

    const zoomOut = () => {
      zoomFactor.value = Math.max(zoomFactor.value - 0.3, 1.0);
    };

    onMounted(() => {
      App.addListener("backButton", () => {
        router.push("/");
        stopScan();
      });
      startScan();
    });

    return {
      stopScan,
      startScan,
      askUser,
      goBack,
      toggleTorch,
      zoomIn,
      zoomOut,
    };
  },
});
</script>
