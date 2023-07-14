import { defineStore } from "pinia";

export const userDataStore = defineStore("userDataStore", () => {
  const logged = false;

  const userData = {
    profile: "src/assets/img/logoUserDefault.png",
    name: "",
    email: "",
    phone: "",
    emailVerified: "",
    description: "",
  };

  const resetData = () => {
    userData.profile = "src/assets/img/logoUserDefault.png";
    userData.name = "";
    userData.email = "";
    userData.phone = "";
    userData.emailVerified = "";
    userData.description = "";
    logged = false;
  };

  return {
    logged,
    userData,
    resetData,
  };
});
