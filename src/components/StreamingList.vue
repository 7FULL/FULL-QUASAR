<template>
  <q-page class="padding_cero">
    <div class="q-pa-md grid">
      <div
        v-for="(stream, index) in streams"
        :key="index"
        cols="12"
        md="4"
        sm="6"
      >
        <router-link :to="'/streaming/' + stream.name">
          <q-card>
            <q-card-section class="text-center">
              <q-avatar>
                <img
                  :src="stream.photoUrl"
                  alt="Stream Image"
                  class="q-mb-md"
                />
              </q-avatar>
              <div class="text-h6 xx-large">{{ stream.name }}</div>
            </q-card-section>
          </q-card>
        </router-link>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";

const streams = ref([]);

//Lo hacemos en el mounted para que se ejecute cuando se cargue el DOM
onMounted(() => {
  fetch("http://localhost:8080/stat")
    .then((response) => response.text())
    .then(async (data) => {
      // Procesar los datos XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const streamElements = xmlDoc.getElementsByTagName("stream");

      // Recorrer los elementos de stream
      for (let i = 0; i < streamElements.length; i++) {
        const name =
          streamElements[i].getElementsByTagName("name")[0].textContent;

        let aux = "";

        /*
        await fetch(
          "http://localhost:5000/api/users/getProfileByStreamName/" + name
        )
          .then((response) => response.blob())
          .then((blob) => {
            // Crear una URL de objeto para la imagen
            if (blob.type === "application/json") {
              aux = "src/assets/img/logoUserDefault.png";
            } else {
              const imageUrl = URL.createObjectURL(blob);
              aux = imageUrl;
            }
          })
          .catch((exception) => {
            console.log(exception);
            error.value.type = true;
            error.value.message =
              "Parece que hay un problema con nuestros servidores. Inténtelo de nuevo más tarde";
          });*/

        //If there is no image, we use the default one
        if (aux === "") {
          aux = "src/assets/img/logoUserDefault.png";
        }

        streams.value.push({ name, photoUrl: aux });
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 10px;
}

.padding_cero {
  padding-top: 0px;
}

.xx-large {
  font-size: xx-large;
}
</style>
