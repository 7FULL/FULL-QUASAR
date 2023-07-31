<template>
  <Streamings></Streamings>
  <q-page-sticky position="bottom-left" :offset="[18, 18]">
    <q-btn color="accent" label="Empezar streaming" @click="open" />
  </q-page-sticky>

  <PopUp
    :open="isOpen"
    msg="¿Como se llamara tu streaming?"
    title="Empezar streaming"
    input="true"
    @closed="closed"
  />

  <PopUp
    :open="isOpenLogin"
    msg="Para poder iniciar un streaming tienes que estar logueado"
    @closed="isOpenLogin = false"
  />

  <q-dialog v-model="isOpenStreaming">
    <q-card class="wsm">
      <q-card-section>
        <div class="text-h6 text-center">Como stremeo</div>
      </q-card-section>

      <q-card-section class="q-pt-none"> Enlace del servidor</q-card-section>

      <q-card-section class="pt-0">
        <q-input
          outlined
          disable
          v-model="userInput.server"
          class="dp-inline-block wlg pt-0"
        />
        <q-btn
          round
          icon="content_copy"
          color="primary"
          @click="copy(userInput.server)"
          class="q-ml-md"
        />
      </q-card-section>

      <q-card-section class="q-pt-none"> Clave de stremeo </q-card-section>

      <q-card-section class="pt-0">
        <q-input
          outlined
          disable
          v-model="userInput.streamKey"
          class="dp-inline-block wlg"
        />
        <q-btn
          round
          icon="content_copy"
          color="primary"
          @click="copy(userInput.streamKey)"
          class="q-ml-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn outline label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import PopUp from "src/components/PopUp.vue";
import Streamings from "../components/StreamingList.vue";
import { ref } from "vue";
import { userDataStore } from "../stores/userData.js";
import { copyToClipboard } from "quasar";
import { useQuasar } from "quasar";

const $q = useQuasar();

function showNotif(msg) {
  $q.notify({
    message: msg,
    color: "gray-4",
    position: "top",
    timeout: 1500,
    progress: true,
  });
}

const copy = (msg) => {
  copyToClipboard(msg);
  showNotif("Copiado al portapapeles");
};

const userStore = userDataStore();

const isOpen = ref(false);
const isOpenLogin = ref(false);
const isOpenStreaming = ref(false);

const open = () => {
  if (userStore.logged) {
    isOpen.value = true;
  } else {
    isOpenLogin.value = true;
    //isOpen.value = true;
  }
};

const userInput = ref({
  server: "",
  streamKey: "",
});

const closed = (name) => {
  if (!name) {
    isOpen.value = false;
    isOpenLogin.value = false;
    return;
  }

  isOpen.value = false;
  isOpenStreaming.value = true;

  userInput.value.server = "rtmp://localhost:1935/live";
  userInput.value.streamKey = `${name}?key=${userStore.userData.streamKey}&username=${userStore.userData.name}`;
};
</script>

<style scoped></style>
