<template>
  <q-page class="padding_cero">
    <Streaming
      :src="'http://localhost:8080/hls/' + $route.params.name + '.m3u8'"
      :room="$route.params.name"
    />
  </q-page>
</template>

<script setup>
import Streaming from "../components/StreamingChat.vue";
</script>
