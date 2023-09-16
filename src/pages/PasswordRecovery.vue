<template>
  <q-page class="flex flex-center">
    <!-- Formulario para recuperar la contraseña 2 simples campos y un boton de confirmar -->
    <q-card>
      <q-card-section class="wxl text-center">
        <q-card-title class="text-h6">Ingresa tu nueva contraseña</q-card-title>
      </q-card-section>
      <q-form class="q-pa-md flex flex-center" @submit="submit">
        <q-input
          :type="showEye ? 'password' : 'text'"
          outlined
          v-model="confirmPasswordData.newPassword"
          label="Contraseña"
          class="wlg q-mt-md q-mb-md"
          required
          minlength="7"
        >
          <template v-slot:append>
            <q-icon
              :name="showEye ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showEye = !showEye"
            />
          </template>
        </q-input>
        <q-input
          :type="showEyeConfirm ? 'password' : 'text'"
          outlined
          v-model="confirmPasswordData.confirmPassword"
          label="Confirmar contraseña"
          class="wlg q-mt-md q-mb-md"
          required
          minlength="7"
        >
          <template v-slot:append>
            <q-icon
              :name="showEyeConfirm ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showEyeConfirm = !showEyeConfirm"
            />
          </template>
        </q-input>
        <q-btn
          label="Confirmar"
          color="primary"
          class="wlg q-mb-lg q-mt-md"
          @click="confirm"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const route = useRoute();

const router = useRouter();

const $q = useQuasar();

function showNotif(msg, color = "gray-4") {
  $q.notify({
    message: msg,
    color: color,
    position: "top",
    timeout: 1500,
    progress: true,
  });
}

const showEyeConfirm = ref(true);

const showEye = ref(true);

const confirmPasswordData = ref({
  oldPassword: "",
  confirmPassword: "",
  newPassword: "",
});

// Obtener el token de la url usando router
const token = route.params.token;

// Actualizar la contraseña antigua con el token
confirmPasswordData.value.oldPassword = token;

const confirm = (e) => {
  e.preventDefault();
  // Lógica para cambiar la contraseña
  if (
    confirmPasswordData.value.newPassword !=
    confirmPasswordData.value.confirmPassword
  ) {
    showNotif("Las contraseñas no coinciden", "red-5");

    confirmPasswordData.value.newPassword = "";
    confirmPasswordData.value.confirmPassword = "";
  } else {
    fetch("http://127.0.0.1:5000/api/users/password/" + token, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(confirmPasswordData.value),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          console.log(data);

          confirmPasswordData.value.oldPassword = "";
          confirmPasswordData.value.confirmPassword = "";
          confirmPasswordData.value.newPassword = "";

          showNotif("Contraseña cambiada correctamente");

          router.push({ name: "home" });
        } else if (data.status == 400) {
          showNotif("Contraseña incorrecta", "red-5");
        } else {
          showNotif(
            "Parece que hubo un error con nuestras bases de datos, por favor intente de nuevo más tarde",
            "red-5"
          );
        }
      })
      .catch((exception) => {
        console.log(exception);

        showNotif(
          "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde",
          "red-5"
        );
      });
  }
};
</script>
