<template>
  <q-dialog v-model="isOpenF" @hide="closeModal" persistent>
    <q-card class="w30 q-mt-sm">
      <q-card-section>
        <q-icon
          name="close"
          size="2rem"
          class="float-right cursor-pointer"
          @click="closeModal"
        />
        <q-tab-panels v-model="activeTab" animated class="wxl">
          <q-tab-panel name="login" class="q-pt-xs q-pb-xs">
            <h2 class="text-h6 q-mt-xs">Iniciar sesión</h2>
            <q-form @submit="login">
              <q-input v-model="loginData.username" label="Usuario" required />
              <q-input
                v-model="loginData.password"
                label="Contraseña"
                type="password"
                required
                minlength="7"
              />
              <q-item side inset-separator v-ripple class="q-mt-sm">
                <q-item-section>
                  <a href="#" class="text-primary">¿Olvidaste tu contraseña?</a>
                </q-item-section>
              </q-item>
              <GoogleLogin :callback="googleLogged" />
              <q-card-actions>
                <q-btn
                  color="primary"
                  label="Confirmar"
                  type="submit"
                  class="wxl"
                />
              </q-card-actions>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="register" class="q-pt-xs q-pb-xs">
            <h2 class="text-h6 q-mt-xs">Registrarse</h2>
            <q-form @submit="register">
              <q-input
                v-model="registerData.username"
                label="Nombre"
                required
              />
              <q-input
                v-model="registerData.email"
                label="Correo electrónico"
                type="email"
                required
              />
              <q-input
                v-model="registerData.password"
                label="Contraseña"
                type="password"
                required
                minlength="7"
              />
              <q-input
                v-model="registerData.confirmPassword"
                label="Confirmar contraseña"
                type="password"
                required
                minlength="7"
              />
              <q-input
                v-model="registerData.phone"
                label="Número de teléfono"
                type="tel"
                required
                class="q-mb-md"
              />
              <Checkbox v-model="registerData.captcha" />
              <q-checkbox
                v-model="registerData.agree"
                :false-value="null"
                required
                class="q-mt-sm"
              >
                Acepto los términos y condiciones
              </q-checkbox>
              <q-card-actions>
                <q-btn
                  color="primary"
                  label="Confirmar"
                  type="submit"
                  class="wxl"
                />
              </q-card-actions>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>

        <div class="text-center">
          <q-tabs inline-label v-model="activeTab">
            <q-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :label="tab.label"
              :color="activeTab == tab.name ? 'primary' : 'white'"
              :text-color="activeTab == tab.name ? 'white' : 'primary'"
            />
          </q-tabs>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <ErrorPopUp
    :error="error.message"
    :open="error.type"
    @closed="clearError"
  ></ErrorPopUp>

  <PopUp
    :open="isVerifying"
    msg="Parece que no tienes verificado tu email. ¿Quieres hacerlo ahora?"
    title="Verificar email"
    persistent="true"
    cancel="true"
    @closed="isVerifyingEmail"
  ></PopUp>

  <PopUp
    :open="isVerifyingEmailPopUp"
    msg="Introduce el token que te hemos enviado a tu correo electrónico"
    title="Verificar email"
    persistent="true"
    input="true"
    @closed="checkToken"
  ></PopUp>
</template>

<script setup>
import { ref, watch } from "vue";
import { Checkbox } from "vue-recaptcha";
import ErrorPopUp from "./ErrorPopUp.vue";
import PopUp from "./PopUp.vue";
import { userDataStore } from "../stores/userData.js";
import { useQuasar } from "quasar";

const userStore = userDataStore();

const tabs = [
  {
    name: "login",
    label: "Iniciar sesión",
  },
  {
    name: "register",
    label: "Registrarse",
  },
];

const verification = ref({
  token: "",
});

const googleLogged = (response) => {
  console.log("Handle the response", response);
};

const isVerifying = ref(false);

const isVerifyingEmailPopUp = ref(false);

const isOpenF = ref(false);

const props = defineProps(["isOpen"]);

const emit = defineEmits(["closeModal", "logged"]);

const activeTab = ref("login");

const error = ref({
  type: 0, // 1 -> login, 2 -> register
  message: "",
});

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

const emailPopUp = ref({
  type: 0, // 1 -> login, 2 -> register
  message: "",
});

const loginData = ref({
  username: "",
  password: "",
  token: "",
});

const registerData = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  agree: null,
  captcha: "",
});

const userData = ref({
  profile: "src/assets/img/logoUserDefault.png",
  name: "",
  email: "",
  phone: "",
  emailVerified: "",
});

const clearError = () => {
  error.value.type = false;
  error.value.message = "";
};

watch(
  () => props.isOpen,
  (newVal) => {
    isOpenF.value = newVal;
  }
);

const isVerifyingEmail = () => {
  verification.value.token = "";
  isVerifying.value = false;
  isVerifyingEmailPopUp.value = true;
  fetch("http://localhost:5000/api/users/registerToken/" + userData.value.name)
    .then((response) => response.json())
    .then((data) => {
      if (data.status != 200) {
        emailPopUp.value.type = 1;
        emailPopUp.value.message =
          "Parece que hubo un problema con tu token de autenticación, por favor intenta de nuevo mas tarde";
      }
    });
};

const checkToken = (userInput) => {
  userInput = {
    token: userInput,
  };

  fetch("http://localhost:5000/api/users/checkToken/" + userData.value.name, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInput),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 200) {
        isVerifying.value = false;
        userData.value.emailVerified = true;
        userStore.userData = userData.value;
        showNotif("Email verificado correctamente");
      } else if (data.status == 401) {
        error.value.type = true;
        error.value.message = "Token incorrecto";
        isVerifying.value = false;
      } else {
        error.value.type = true;
        error.value.message =
          "Parece que hubo un problema con nuestras bases de datos, porfavor intentelo de nuevo mas tarde";
      }

      verification.value.token = "";
    })
    .catch((exception) => {
      console.error("Error:", exception);
      error.value.type = true;
      error.value.message =
        "Parece que hubo un problema con nuestros servidores, porfavor intentelo de nuevo mas tarde";
    });
};

function captchaV3() {
  return new Promise((resolve, reject) => {
    grecaptcha.ready(function () {
      grecaptcha
        .execute("6Lc099EmAAAAAI_Ra6YRJ35X0FjthvtuXyH0X8E9", {
          action: "submit",
        })
        .then(function (token) {
          resolve(token); // Resuelve la promesa después de asignar el token
        })
        .catch(function (error) {
          reject(error); // Rechaza la promesa si ocurre un error
        });
    });
  });
}

const closeModal = () => {
  emit("closeModal");
  switchTab("login");
};

const logged = async () => {
  let id = "";

  if (userData.value.name != "") {
    id = userData.value.name;
  } else {
    id = userData.value.email;
  }

  let aux = null;

  //Obtener los datos que nos faltan de la base de datos
  await fetch("http://127.0.0.1:5000/api/users/" + id)
    .then((response) => response.json())
    .then(async (data) => {
      if (data.status == 200) {
        userData.value.phone = data.result.phone;
        userData.value.description = data.result.description;
        userData.value.name = data.result.username;
        userData.value.email = data.result.email;
        userData.value.emailVerified = data.result.emailVerified;
        userData.value.streamKey = data.result.streamKey;

        //console.log(userData.value);

        if (data.result.profile != "") {
          userData.value.profile = data.result.profile;

          await fetch(
            "http://127.0.0.1:5000/api/users/profile/" + userData.value.name
          )
            .then((response) => response.blob())
            .then((blob) => {
              // Crear una URL de objeto para la imagen
              const imageUrl = URL.createObjectURL(blob);

              aux = imageUrl;
            })
            .catch((exception) => {
              console.log(exception);
              error.value.type = true;
              error.value.message =
                "Parece que hay un problema con nuestros servidores. Inténtelo de nuevo más tarde";
            });
        }
      } else {
        error.value.type = true;
        error.value.message =
          "Parece que hay un problema con nuestros servidores. Inténtelo de nuevo más tarde";
      }

      if (aux != null) {
        userData.value.profile = aux;
      }

      userStore.userData = userData.value;

      userStore.logged = true;

      if (!userData.value.emailVerified) {
        isVerifying.value = true;
      }
    })
    .catch((exception) => {
      console.log(exception);
      error.value.type = true;
      error.value.message =
        "Parece que hay un problema con nuestros servidores. Inténtelo de nuevo más tarde";
    });

  showNotif("Bienvenido/a de vuelta " + userData.value.name);
  emit("logged");
};

const switchTab = (tab) => {
  activeTab.value = tab;
};

// Hay que hacerla asíncrona para poder esperar al token
const login = async (e) => {
  e.preventDefault();

  //Limpiamos los datos del usuario
  userData.value.name = "";
  userData.value.email = "";
  userData.value.phone = "";
  userData.value.description = "";
  userData.value.profile = "src/assets/img/logoUserDefault.png";

  isVerifyingEmailPopUp.value = false;
  isVerifying.value = false;

  const token = await captchaV3();
  loginData.value.token = token;

  userData.value.name = loginData.value.username;

  fetch("http://127.0.0.1:5000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData.value),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 200 || data.status == 401) {
        if (data.result == true) {
          closeModal();
          logged();
        } else {
          //Usuario incorrecto
          error.value.type = true;
          error.value.message = data.error;
        }
        //Captcha no válido o caducado
      } else if (data.status == 498) {
        error.value.type = true;
        error.value.message = data.error;
      } else {
        error.value.type = true;
        error.value.message =
          "Parece que hay un problema con nuestras bases de datos. Inténtelo de nuevo más tarde";
      }
    })
    .catch((exception) => {
      console.log(exception);
      error.value.type = true;
      error.value.message =
        "Parece que hay un problema con nuestros servidores. Inténtelo de nuevo más tarde";
    });

  // Resetear el formulario
  loginData.value.username = "";
  loginData.value.password = "";
  loginData.value.token = "";
};

const register = async (e) => {
  e.preventDefault();
  if (registerData.value.password != registerData.value.confirmPassword) {
    error.value.type = true;
    error.value.message = "Las contraseñas no coinciden";
  } else if (registerData.value.agree == true && registerData.value.captcha) {
    if (!registerData.value.username.includes("@")) {
      userData.value.name = registerData.value.username;
    } else {
      userData.value.email = registerData.value.email;
    }

    await fetch("http://127.0.0.1:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData.value),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        if (data.status == 200) {
          closeModal();
          logged();
        } else if (data.status == 409) {
          error.value.type = true;
          error.value.message =
            "El nombre de usuario o el correo electrónico ya están en uso";
        } else {
          error.value.type = true;
          error.value.message =
            "Parece que hay un problema con nuestras bases de datos. Inténtelo de nuevo más tarde";
        }
      })
      .catch((exception) => {
        console.log(exception);
        error.value.type = true;
        error.value.message =
          "Parece que hay un problema con nuestros servidores. Inténtelo de nuevo más tarde";
      });
  } else {
    if (!registerData.value.captcha) {
      error.value.type = true;
      error.value.message = "Debes completar el captcha";
    } else {
      console.log(registerData.value.agree);
      error.value.type = true;
      error.value.message = "Debe aceptar los términos y condiciones";
    }
  }

  // Resetear el formulario
  registerData.value.username = "";
  registerData.value.email = "";
  registerData.value.password = "";
  registerData.value.confirmPassword = "";
  registerData.value.phone = "";
  registerData.value.agree = null;
};
</script>

<style scoped></style>
