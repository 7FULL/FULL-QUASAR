<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md wsmx">
      <input
        type="file"
        ref="photo"
        style="display: none"
        id="photo"
        accept="image/jpeg, image/png"
      />
      <div class="profile-header">
        <q-avatar class="mg-auto dp-block" size="500%">
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
          style="
            position: absolute;
            top: 5%;
            left: 58%;
            transform: translate(-50%, -50%);
          "
          class="edit-button"
          flat
          round
          dense
          icon="edit"
          @click="selectPhoto"
        ></q-btn>
      </div>
      <div class="profile-info">
        <h2 class="text-center q-mt-md">{{ userStore.userData.name }}</h2>
        <q-input
          class="description"
          v-model="userStore.userData.description"
          placeholder="Escribe una descripción..."
          @input="changed"
          type="textarea"
          label="Biografía"
          filled
          autogrow
        ></q-input>

        <!-- En caso de que el usuario no tenga el email verificado mostramos este boton para que lo verifique -->
        <q-btn
          v-if="!userStore.userData.emailVerified"
          class="q-mt-md wxl"
          color="secondary"
          label="Verificar Email"
          @click="verifyEmail"
        ></q-btn>

        <div class="flex justify-evenly q-mb-md">
          <div class="col">
            <q-input
              v-model="userStore.userData.email"
              filled
              disable
              class="q-mt-md"
            ></q-input>
            <q-input
              type="password"
              v-model="passwordPlaceholder"
              disable
              filled
              class="q-mt-md q-mb-md"
            ></q-input>
            <q-input
              type="tel"
              v-model="userStore.userData.phone"
              disable
              filled
            ></q-input>
          </div>

          <div class="col q-ml-md">
            <q-btn
              class="mt-md mb-lg wxl"
              flat
              dense
              color="primary"
              @click="openModalEmail"
              >Cambiar Email</q-btn
            >
            <q-btn
              class="mt-xxs mb-md wxl"
              flat
              dense
              color="primary"
              @click="openModalPass"
              >Cambiar Contraseña</q-btn
            >
            <q-btn
              class="mt-xs wxl"
              flat
              color="primary"
              @click="openModalPhone"
              >Cambiar Teléfono</q-btn
            >
          </div>
        </div>

        <div class="flex flex-center">
          <q-btn class="q-mb-sm" outline color="negative" @click="deleteAccount"
            >ELIMINAR CUENTA</q-btn
          >
        </div>
      </div>
      <div class="botones flex justify-end">
        <q-btn class="q-mr-sm" color="negative" @click="closeProfile"
          >Salir</q-btn
        >
        <q-btn color="primary" @click="editProfile">Guardar</q-btn>
      </div>
    </q-card>
    <q-dialog v-model="isOpenPass">
      <q-card>
        <q-card-section>
          <h3>Cambio de Contraseña</h3>
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
              class="q-mb-md q-mt-md"
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
          <h3>Cambio de Email</h3>
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
              class="q-mb-md q-mt-md"
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
          <h3>Cambio de Teléfono</h3>
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
              class="q-mb-md q-mt-md"
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
          <h3>Eliminacion de cuenta</h3>
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
    <PopUp
      :open="pop.active"
      :msg="pop.message"
      title="Eliminar Cuenta"
      cancel="true"
      cancelText="Cancelar"
      @closed="deleteUser"
    />
  </q-page>

  <EmailVerification @verified="emailVerified" :isOpen="isVerifying" />
</template>

<script setup>
//import { ref , defineEmits, defineProps, toRefs} from "vue";
import { ref } from "vue";
import { userDataStore } from "../stores/userData.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import PopUp from "src/components/PopUp.vue";
import EmailVerification from "../components/EmailVerification.vue";

const passwordPlaceholder = ref("********");

const $q = useQuasar();

const isVerifying = ref(false);

const verifyEmail = () => {
  isVerifying.value = true;
};

const emailVerified = () => {
  userStore.userData.emailVerified = true;
  showNotif("Email verificado correctamente");
};

function showNotif(msg, color = "gray-4") {
  $q.notify({
    message: msg,
    color: color,
    position: "top",
    timeout: 1500,
    progress: true,
  });
}

const pop = ref({
  active: false,
  message: "",
});

const userStore = userDataStore();

const router = useRouter();

if (!userStore.logged) {
  showNotif("Necesitas estar logueado para editar tu perfil", "red-5");
  router.push({ name: "home" });
}

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
        showNotif("Contraseña incorrecta", "red-5");
      } else {
        console.log(data);

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
};

const changePassword = (e) => {
  e.preventDefault();
  // Lógica para cambiar la contraseña
  if (changePass.value.newPassword != changePass.value.confirmPassword) {
    showNotif("Las contraseñas no coinciden", "red-5");

    changePass.value.newPassword = "";
    changePass.value.confirmPassword = "";
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
      if (data.status == 200) {
        userStore.userData.phone = changePhon.value.newPhone;

        changePhon.value.password = "";
        changePhon.value.newPhone = "";

        closeModalPhone();
        showNotif("Teléfono cambiado correctamente");
      } else if (data.status == 400) {
        changePhon.value.password = "";

        showNotif(data.result, "red-5");
      } else {
        showNotif(
          "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde",
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
              showNotif(data.message, "red-5");
            }
            if (data.status == 500) {
              showNotif(
                "Parece que hay un problema con nuestras bases de datos. Inténtelo de nuevo más tarde",
                "red-5"
              );
            }
          } else {
            aux2 = true;
            shoqNotif("Foto de perfil actualizada");
          }
        })
        .catch((exception) => {
          console.error(exception);
          showNotif(
            "Parece que hay un problema con nuestros servidores. Inténtelo de nuevo más tarde",
            "red-5"
          );
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
            showNotif(data.message, "red-5");
          }
          if (data.status == 500) {
            showNotif(
              "Parece que hay un problema con nuestras bases de datos. Inténtelo de nuevo más tarde",
              "red-5"
            );
          }
        }
      })
      .catch((exception) => {
        console.error(exception);
        showNotif(
          "Parece que hay un problema con nuestros servidores. Inténtelo de nuevo más tarde",
          "red-5"
        );
      });

    if (aux2) {
      router.push({ name: "home" });
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
  pop.value.active = true;
  pop.value.message = "¿Estas seguro de que quieres eliminar tu cuenta?";
};

const deleteUser = () => {
  console.log(deleteAccountData.value);
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

        pop.value.active = false;
        pop.value.message = "";
      } else if (data.status == 401) {
        showNotif(data.message, "red-5");
      } else {
        showNotif(
          "Parece que hubo un error con nuestros servidores, por favor intente de nuevo más tarde",
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
