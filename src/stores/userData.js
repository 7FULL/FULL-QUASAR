import { defineStore } from "pinia";

export const userDataStore = defineStore("userDataStore", () => {
  let logged = false;

  const userData = {
    profile: "src/assets/img/logoUserDefault.png",
    name: "",
    email: "",
    phone: "",
    emailVerified: "",
    description: "",
    streamKey: "",
  };

  const resetData = () => {
    userData.value.profile = "src/assets/img/logoUserDefault.png";
    userData.value.name = "";
    userData.value.email = "";
    userData.value.phone = "";
    userData.value.emailVerified = "";
    userData.value.description = "";
    userData.value.streamKey = "";
    logged = false;
  };

  return {
    logged,
    userData,
    resetData,
  };
});
