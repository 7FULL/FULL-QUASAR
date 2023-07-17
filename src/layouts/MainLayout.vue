<template>
  <q-layout view="hHh lpr lff">
    <q-header elevated>
      <q-toolbar class="flex justify-between bg-secondary">
        <div class="wxs">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />

          <RouterLink to="/">
            <q-img
              src="../assets/img/logo_remove.png"
              spinner-color="white"
              style="max-width: 100px"
            />
          </RouterLink>
        </div>

        <q-input
          class="q-ma-sm"
          outlined
          dark
          dense
          placeholder="Buscar ..."
          v-model="busqueda"
        >
          <template v-slot:append>
            <q-icon name="search" class="text-white" />
          </template>
        </q-input>

        <div class="avatar-container">
          <div v-if="isLogged">
            <q-btn
              v-if="userStore.userData.profile != null"
              round
              @click="viewProfile"
            >
              <q-avatar>
                <img :src="userStore.userData.profile" alt="User Avatar 4" />
              </q-avatar>
              <q-tooltip class="bg-green">Ver perfil</q-tooltip>
            </q-btn>
            <q-btn v-else round @click="viewProfile">
              <q-avatar>
                <img
                  src="../assets/img/logoUserDefault.png"
                  alt="User Avatar2"
                />
              </q-avatar>
              <q-tooltip class="bg-green">Ver perfil</q-tooltip>
            </q-btn>
            <q-btn
              color="primary"
              icon="logout"
              @click="closeSession"
              class="q-ml-sm"
              size="md"
              round
            >
              <q-tooltip class="bg-red">Cerrar sesión</q-tooltip>
            </q-btn>
          </div>
          <div v-else>
            <q-btn
              color="primary"
              icon-right="login"
              label="Iniciar sesion"
              @click="openModal"
            />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <login
      :isOpen="modalOpen"
      @closeModal="closeModal"
      @logged="logged"
    ></login>

    <q-page-container style="padding-top: 0%">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import login from "../components/LoginPage.vue";
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { RouterLink, useRouter } from "vue-router";
import { userDataStore } from "../stores/userData.js";

const userStore = userDataStore();

const router = useRouter();

const userData = userStore.userData;

const isLogged = ref(false);

const modalOpen = ref(false);

const dropdown = ref(false);

const dropdownLogin = ref(false);

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

if (userStore.logged) {
  isLogged.value = true;
}

const emit = defineEmits("closeSession", "logged");

const openModal = () => {
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const closeSession = () => {
  userStore.logged = false;

  userStore.userData = {
    profile: "src/assets/img/logoUserDefault.png",
    name: "",
    email: "",
    phone: "",
    emailVerified: "",
    description: "",
  };

  isLogged.value = false;
  dropdownLogin.value = false;
  dropdown.value = false;

  router.push({ name: "home" });
  //emit('closeSession');
};

const logged = () => {
  isLogged.value = true;
  userData.value = userStore.userData;
  modalOpen.value = false;
};

const viewProfile = () => {
  router.push({ name: "viewProfile" });
  //emit("profile");
};
</script>

<style scoped></style>
