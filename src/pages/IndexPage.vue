<template>
  <q-page class="padding_cero">
    <Streaming src="http://localhost:8080/hls/test.m3u8" room="1" />
  </q-page>
</template>

<script setup>
import Streaming from "../components/StreamingChat.vue";
</script>

<style scoped>
.padding_cero {
  padding-top: 0px;
}
</style>
