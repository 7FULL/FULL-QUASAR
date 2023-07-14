<template>
  <q-page class="flex flex-center">
    <div class="profile">
      <input
        type="file"
        ref="photo"
        style="display: none"
        id="photo"
        accept="image/jpeg, image/png"
      />
      <div class="profile-header">
        <q-avatar>
          <img
            class="profile-image"
            v-if="userStore.userData.profile != null"
            :src="userStore.userData.profile"
            alt="Foto de perfil"
          />
          <img
            class="profile-image"
            v-else
            src="../assets/img/logoUserDefault.png"
            @click="selectPhoto"
            alt="Foto de perfil2"
          />
        </q-avatar>
        <q-btn
          class="edit-button"
          flat
          round
          dense
          icon="edit"
          @click="selectPhoto"
        ></q-btn>
      </div>
      <div class="profile-info">
        <h2>{{ userStore.userData.name }}</h2>
        <q-textarea
          class="description"
          v-model="userStore.userData.description"
          placeholder="Biografía"
          @input="changed"
        ></q-textarea>
        <div class="field">
          <q-input v-model="userStore.userData.email" readonly></q-input>
          <q-btn
            class="change-button"
            flat
            dense
            color="primary"
            @click="openModalEmail"
            >Cambiar Email</q-btn
          >
        </div>
        <div class="field">
          <q-input
            type="password"
            v-model="passwordPlaceholder"
            readonly
          ></q-input>
          <q-btn
            class="change-button"
            flat
            dense
            color="primary"
            @click="openModalPass"
            >Cambiar Contraseña</q-btn
          >
        </div>
        <div class="field">
          <q-input
            type="tel"
            v-model="userStore.userData.phone"
            readonly
          ></q-input>
          <q-btn
            class="change-button"
            flat
            dense
            color="primary"
            @click="openModalPhone"
            >Cambiar Teléfono</q-btn
          >
        </div>
        <div class="field">
          <q-btn
            class="delete"
            flat
            round
            dense
            color="negative"
            @click="deleteAccount"
            >ELIMINAR CUENTA</q-btn
          >
        </div>
      </div>
      <div class="botones">
        <q-btn
          class="Salir"
          flat
          round
          dense
          color="negative"
          @click="closeProfile"
          >Salir</q-btn
        >
        <q-btn flat round dense color="primary" @click="editProfile"
          >Guardar</q-btn
        >
      </div>
    </div>
    <q-dialog v-model="isOpenPass">
      <q-card>
        <q-card-section>
          <h2>Cambio de Contraseña</h2>
          <q-form @submit="changePassword">
            <q-input
              type="password"
              label="Contraseña actual"
              v-model="changePass.oldPassword"
              dense
              required
            ></q-input>
            <q-input
              type="password"
              label="Contraseña nueva"
              v-model="changePass.newPassword"
              dense
              required
            ></q-input>
            <q-input
              type="password"
              label="Confirmar Contraseña"
              v-model="changePass.confirmPassword"
              dense
              required
            ></q-input>
            <q-card-actions align="right">
              <q-btn
                label="Salir"
                flat
                round
                dense
                color="negative"
                @click="closeModalPass"
              />
              <q-btn
                type="submit"
                label="Guardar Cambios"
                flat
                round
                dense
                color="primary"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isOpenMail">
      <q-card>
        <q-card-section>
          <h2>Cambio de Email</h2>
          <q-form @submit="changeEmail">
            <q-input
              type="password"
              label="Contraseña"
              v-model="changeMail.password"
              dense
              required
            ></q-input>
            <q-input
              type="email"
              label="Email nuevo"
              v-model="changeMail.newMail"
              dense
              required
            ></q-input>
            <q-card-actions align="right">
              <q-btn
                label="Salir"
                flat
                round
                dense
                color="negative"
                @click="closeModalEmail"
              />
              <q-btn
                type="submit"
                label="Guardar Cambios"
                flat
                round
                dense
                color="primary"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isOpenPhone">
      <q-card>
        <q-card-section>
          <h2>Cambio de Teléfono</h2>
          <q-form @submit="changePhone">
            <q-input
              type="password"
              label="Contraseña"
              v-model="changePhon.password"
              dense
              required
            ></q-input>
            <q-input
              type="tel"
              label="Teléfono nuevo"
              v-model="changePhon.newPhone"
              dense
              required
            ></q-input>
            <q-card-actions align="right">
              <q-btn
                label="Salir"
                flat
                round
                dense
                color="negative"
                @click="closeModalPhone"
              />
              <q-btn
                type="submit"
                label="Guardar Cambios"
                flat
                round
                dense
                color="primary"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="changingPassword">
      <q-card>
        <q-card-section>
          <h2>Eliminacion de cuenta</h2>
          <q-form @submit="confirmPassword">
            <q-input
              type="password"
              label="Contraseña"
              v-model="deleteAccountData.password"
              dense
              required
            ></q-input>
            <q-card-actions align="right">
              <q-btn
                label="Salir"
                flat
                round
                dense
                color="negative"
                @click="closeAll"
              />
              <q-btn
                type="submit"
                label="Guardar Cambios"
                flat
                round
                dense
                color="primary"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="error.type">
      <q-card>
        <q-card-section class="row items-center">
          <img src="../assets/img/peligro.png" alt="Error" class="error-icon" />
          <p>{{ error.message }}</p>
          <q-btn
            v-if="error.type !== 2"
            label="Confirmar"
            flat
            round
            dense
            color="primary"
            @click="clearError"
          />
          <q-btn
            v-if="error.type === 2"
            label="Confirmar"
            flat
            round
            dense
            color="primary"
            @click="deleteUser"
          />
          <q-btn
            v-if="error.type === 2"
            label="Cancelar"
            flat
            round
            dense
            color="primary"
            @click="clearError"
            class="error-confirm"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
//import { ref , defineEmits, defineProps, toRefs} from "vue";
import { ref } from "vue";
import { userDataStore } from "../stores/userData.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const passwordPlaceholder = ref("********");

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

const userStore = userDataStore();

const router = useRouter();

const emit = defineEmits(["closeProfile"]);

const isOpenPass = ref(false);
const isOpenMail = ref(false);
const isOpenPhone = ref(false);

//const props = defineProps(["viewingProfile"]);
//const refViewProfile = toRefs(props)

const deleteAccountData = ref({
  password: "",
});

const closeModalPass = () => {
  isOpenPass.value = false;
};

const openModalPass = () => {
  isOpenPass.value = true;
  isOpenMail.value = false;
  isOpenPhone.value = false;
};

const closeModalEmail = () => {
  isOpenMail.value = false;
};

const openModalEmail = () => {
  isOpenMail.value = true;
  isOpenPass.value = false;
  isOpenPhone.value = false;
};

const closeModalPhone = () => {
  isOpenPhone.value = false;
};

const openModalPhone = () => {
  isOpenPhone.value = true;
  isOpenPass.value = false;
  isOpenMail.value = false;
};

const clearError = () => {
  error.value.type = 0;
  error.value.message = "";
};

const error = ref({
  type: 0, // 0: no error, 1: error
  message: "",
});

const changePass = ref({
  oldPassword: "",
  confirmPassword: "",
  newPassword: "",
});

const changeMail = ref({
  password: "",
  newMail: "",
});

const changePhon = ref({
  password: "",
  newPhone: "",
});

let profileChanged = false;

const changeEmail = (e) => {
  e.preventDefault();
  // Lógica para cambiar el email
  fetch("http://127.0.0.1:5000/api/users/email/" + userStore.userData.name, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changeMail.value),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status == 200) {
        userStore.userData.email = changeMail.value.newMail;

        changeMail.value.password = "";
        changeMail.value.newMail = "";

        closeModalEmail();

        showNotif("Email cambiado correctamente");

        //location.reload();
      } else if (data.status == 400) {
        error.value.type = 1;
        error.value.message = "Contraseña incorrecta";
      } else {
        console.log(data);

        error.value.type = 1;
        error.value.message =
          "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde";
      }
    })
    .catch((exception) => {
      console.log(exception);

      error.value.type = 1;
      error.value.message =
        "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde";
    });
};

const changePassword = (e) => {
  e.preventDefault();
  // Lógica para cambiar la contraseña
  if (changePass.value.newPassword != changePass.value.confirmPassword) {
    error.value.type = 1;
    error.value.message = "Las contraseñas no coinciden";

    console.log("Las contraseñas no coinciden");
  } else {
    fetch(
      "http://127.0.0.1:5000/api/users/password/" + userStore.userData.name,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changePass.value),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          changePass.value.oldPassword = "";
          changePass.value.confirmPassword = "";
          changePass.value.newPassword = "";

          closeModalPass();
          showNotif("Contraseña cambiada correctamente");
        } else if (data.status == 400) {
          error.value.type = 1;
          error.value.message = "Contraseña incorrecta";
        } else {
          console.log(data);

          error.value.type = 1;
          error.value.message =
            "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde";
        }
      })
      .catch((exception) => {
        console.log(exception);

        error.value.type = 1;
        error.value.message =
          "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde";
      });
  }
};

const changePhone = (e) => {
  // Lógica para cambiar el teléfono
  e.preventDefault();
  // Lógica para cambiar el email
  fetch("http://127.0.0.1:5000/api/users/phone/" + userStore.userData.name, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changePhon.value),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status == 200) {
        userStore.userData.phone = changePhon.value.newPhone;

        changePhon.value.password = "";
        changePhon.value.newPhone = "";

        closeModalPhone();
        showNotif("Teléfono cambiado correctamente");
      } else if (data.status == 400) {
        changePhon.value.password = "";

        error.value.type = 1;
        error.value.message = "Contraseña incorrecta";
      } else {
        console.log(data);

        error.value.type = 1;
        error.value.message =
          "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde";
      }
    })
    .catch((exception) => {
      console.log(exception);

      error.value.type = 1;
      error.value.message =
        "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde";
    });
};

const editProfile = async () => {
  let aux2 = false;
  // Lógica para editar el perfil
  if (profileChanged) {
    // Lógica para guardar los cambios
    if (userStore.userData.profile == "") {
      userStore.userData.profile = "../assets/img/logoUserDefault.png";
    }

    if (
      userStore.userData.profile != "../assets/img/logoUserDefault.png" &&
      file != null
    ) {
      const formData = new FormData();
      formData.append("profile", file);

      await fetch(
        "http://127.0.0.1:5000/api/users/profile/" + userStore.userData.name,
        {
          method: "PUT",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status != 200) {
            //console.log("Foto de perfil actualizada");
            if (
              data.status == 400 ||
              data.status == 413 ||
              data.status == 404
            ) {
              error.value.type = 1;
              error.value.message = data.message;
            }
            if (data.status == 500) {
              error.value.type = 1;
              error.value.message =
                "Parece que hay un problema con nuestras bases de datos. Inténtelo de nuevo más tarde";
            }
          } else {
            aux2 = true;
            shoqNotif("Foto de perfil actualizada");
          }
        })
        .catch((exception) => {
          console.error(exception);
          error.value.type = 1;
          error.value.message =
            "Parece que hay un problema con nuestros servidores. Inténtelo de nuevo más tarde";
        });
    }

    await fetch(
      "http://127.0.0.1:5000/api/users/description/" + userStore.userData.name,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: userStore.userData.description,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status != 200) {
          //console.log("Descripción actualizada");
          if (data.status == 400 || data.status == 413 || data.status == 404) {
            error.value.type = 1;
            error.value.message = data.message;
          }
          if (data.status == 500) {
            error.value.type = 1;
            error.value.message =
              "Parece que hay un problema con nuestras bases de datos. Inténtelo de nuevo más tarde";
          }
        }
      })
      .catch((exception) => {
        console.error(exception);
        error.value.type = 1;
        error.value.message =
          "Parece que hay un problema con nuestros servidores. Inténtelo de nuevo más tarde";
      });

    if (aux2) {
      location.reload();
    }

    closeProfile();
    //console.log(userStore.userData);
  } else {
    closeProfile();
  }
};

const closeProfile = () => {
  //emit("closeProfile");
  router.push({ name: "home" });
};

function changed() {
  profileChanged = true;
}

const changingPassword = ref(false);

const deleteAccount = () => {
  changingPassword.value = true;
  isOpenMail.value = false;
  isOpenPhone.value = false;
  isOpenPass.value = false;
};

const closeAll = () => {
  changingPassword.value = false;
  isOpenMail.value = false;
  isOpenPhone.value = false;
  isOpenPass.value = false;
};

const confirmPassword = (e) => {
  e.preventDefault();
  error.value.type = 2;
  error.value.message = "¿Estas seguro de que quieres eliminar tu cuenta?";
};

const deleteUser = (e) => {
  // Lógica para eliminar el usuario
  e.preventDefault();
  // Lógica para cambiar el email
  fetch("http://127.0.0.1:5000/api/users/" + userStore.userData.name, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deleteAccountData.value),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 200) {
        userStore.resetData();
        router.push({ name: "home" });
        showNotif("Cuenta eliminada correctamente");
      } else if (data.status == 401) {
        console.log(data);

        error.value.type = 1;
        error.value.message = data.result;
      } else {
        console.log(data);

        error.value.type = 1;
        error.value.message =
          "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde";
      }
    })
    .catch((exception) => {
      console.log(exception);

      error.value.type = 1;
      error.value.message =
        "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde";
    });
};

let file = null;

const selectPhoto = () => {
  // Lógica para seleccionar una foto
  let foto = document.getElementById("photo");
  foto.click();

  foto.addEventListener("change", () => {
    let fileAux = foto.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
      var imageUrl = event.target.result;
      userStore.userData.profile = imageUrl;
    };
    reader.readAsDataURL(fileAux);

    file = fileAux;

    changed();
  });
};
</script>

<style scoped></style>
