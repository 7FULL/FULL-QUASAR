<template>
  <q-page class="padding_cero">
    <!--<Streaming src="http://localhost:8080/hls/test.m3u8" room="1" />-->
    <div id="streamData"></div>
  </q-page>
</template>

<script setup>
import Streaming from "../components/StreamingChat.vue";

fetch("http://localhost:8080/stat")
  .then((response) => response.text())
  .then((data) => {
    // Procesar los datos XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");
    const streams = xmlDoc.getElementsByTagName("stream");

    // Recorrer los elementos de stream
    for (let i = 0; i < streams.length; i++) {
      const name = streams[i].getElementsByTagName("name")[0].textContent;
      const time = streams[i].getElementsByTagName("time")[0].textContent;
      const bwIn = streams[i].getElementsByTagName("bw_in")[0].textContent;
      const bwOut = streams[i].getElementsByTagName("bw_out")[0].textContent;
      // Obtén otros datos que desees mostrar

      // Mostrar los datos en tu página web
      const streamInfo = `Nombre: ${name}<br>
                          Tiempo: ${time}<br>
                          Ancho de banda de entrada: ${bwIn}<br>
                          Ancho de banda de salida: ${bwOut}<br><br>`;

      document.getElementById("streamData").innerHTML += streamInfo;
    }
  })
  .catch((error) => {
    console.log("Error:", error);
  });
</script>

<style scoped>
.padding_cero {
  padding-top: 0px;
}
</style>
