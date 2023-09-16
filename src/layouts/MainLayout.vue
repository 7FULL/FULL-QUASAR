<template>
  <q-layout view="hHh LpR fFf">
    <q-header>
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
        <q-item-label header />
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
        <q-btn
          v-if="isLogged"
          color="primary"
          label="Cerrar sesión"
          icon-right="logout"
          @click="closeSession"
          class="q-ml-sm"
          style="width: 95%; margin-top: 124%"
        >
          <q-tooltip class="bg-red">Cerrar sesión</q-tooltip>
        </q-btn>
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
import login from "../components/LoginComponent.vue";
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
    title: "Home",
    caption: "Página principal",
    icon: "school",
    link: "/",
  },
  {
    title: "Streamings",
    caption: "Mira a tus sreamers favoritos",
    icon: "token",
    link: "/streamings",
  },
  {
    title: "Perfil",
    caption: "Configura tu perfil",
    icon: "person",
    link: "/viewProfile",
  },
  {
    title: "Mensajes directos",
    caption: "Habla con la gente que te importa",
    icon: "mail",
    link: "/dms",
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

  if (localStorage.getItem("username") != null) {
    localStorage.removeItem("username");
  }

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

<style></style>
