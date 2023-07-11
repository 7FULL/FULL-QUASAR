<template>
  <q-layout view="hHh Lpr lff">
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
            <q-img src="../assets/img/logo_remove.png" spinner-color="white" style="max-width: 100px;"
            />
          </RouterLink>
        </div>

        <q-input class="q-ma-sm" outlined dark dense placeholder="Buscar ..." v-model="busqueda">
          <template v-slot:append>
            <q-icon name="search" class="text-white"/>
          </template>

        </q-input>

        <div class="avatar-container">
          <div v-if="isLogged">
            <q-btn v-if="userData != null" round>
              <q-avatar>
                <img :src="userData.profile" alt="User Avatar">
              </q-avatar>
              <q-tooltip class="bg-green">Ver perfil</q-tooltip>
            </q-btn>
            <q-btn v-else round>
              <q-avatar>
                <img src="../assets/img/logoUserDefault.png" alt="User Avatar">
              </q-avatar>
              <q-tooltip class="bg-green">Ver perfil</q-tooltip>
            </q-btn>
          </div>
          <template v-else>
            <q-btn color="primary" icon-right="login" label="Iniciar sesion" @click="openModal"/>
          </template>
        </div>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <login :isOpen="modalOpen" @closeModal="closeModal" @logged="logged"></login>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import login from "../components/LoginPage.vue";
import { ref, computed } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { RouterLink } from 'vue-router';





const userData = ref(JSON.parse(sessionStorage.getItem("userData")));

const isLogged = ref(false);

const modalOpen = ref(false);

const isVerifying = ref(false);

const error = ref({
        type: 0,         // 0: no error, 1: error
        message: ''
    });

const dropdown = ref(false);

const dropdownLogin = ref(false);

const verification = ref({
  token: "",
});

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

const leftDrawerOpen = ref(false);





const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const clearError = () => {
  error.value.type = 0;
  error.value.message = "";
}

const styleLogin = computed(() => {
  if(!userData.value.emailVerified){
    return "dropdown-menu-loginNotVerified";
  }

  return "dropdown-menu-login";
});

if (sessionStorage.getItem("userData") != null) {
  isLogged.value = true;
}

const checkToken = (e) => {
  e.preventDefault();

  fetch("http://localhost:5000/api/users/checkToken/"+userData.value.name, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(verification.value),
  })
  .then(response => response.json())
  .then(data => {
    if(data.status == 200){
      isVerifying.value = false;
      userData.value.emailVerified = true;
      sessionStorage.setItem("userData", JSON.stringify(userData.value));
    }
    else if(data.status == 401){
      error.value.type = 1;
      error.value.message = "Token incorrecto";
      isVerifying.value = false;
    }
    else{
      error.value.type = 1;
      error.value.message = "Parece que hubo un problema con nuestras bases de datos, porfavor intentelo de nuevo mas tarde";
    }

    verification.value.token = "";
  })
  .catch((exception) => {
    console.error("Error:", exception);
    error.value.type = 1;
    error.value.message = "Parece que hubo un problema con nuestros servidores, porfavor intentelo de nuevo mas tarde";
  });
}

const isVerifyingEmail = () => {
  isVerifying.value = true;
  fetch("http://localhost:5000/api/users/registerToken/"+userData.value.name)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.status != 200){
      error.value.type = 1;
      error.value.message = "Parece que hubo un problema con tu token de autenticación, por favor intenta de nuevo mas tarde";
    }
  })
}

const emit  = defineEmits('closeSession' , 'logged');

const openModal = () => {
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const switchDropdown = () => {
  dropdown.value = !dropdown.value;
  if (dropdown.value) {
    dropdownLogin.value = false;
  }
};

const switchDropdownLogin = () => {
  dropdownLogin.value = !dropdownLogin.value;
  if (dropdownLogin.value) {
    dropdown.value = false;
  }
};

const closeSession = () => {
  sessionStorage.removeItem("userData");
  isLogged.value = false;
  dropdownLogin.value = false;
  dropdown.value = false;

  router.push({ name: "home" });
  //emit('closeSession');
};

const logged = () => {
  isLogged.value = true;
  userData.value = JSON.parse(sessionStorage.getItem("userData"));
  modalOpen.value = false;
};

const viewProfile = () => {
  dropdown.value = false;
  dropdownLogin.value = false;
  //emit("profile");
};

const closedProfile = () => {
  dropdown.value = false;
  dropdownLogin.value = false;
};
</script>

<style scoped>



</style>

