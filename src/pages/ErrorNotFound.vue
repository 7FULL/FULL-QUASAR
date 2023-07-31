<template>
  <q-page class="flex flex-center">
    <div>
      <p class="text-h6 q-mb-md">Parece que te has perdido</p>
      <q-btn
        color="primary"
        label="Volver a la página de inicio"
        @click="redirectToHome"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const redirectToHome = () => {
  router.push({ name: "home" });
};
</script>
