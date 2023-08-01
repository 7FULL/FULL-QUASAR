import { boot } from "quasar/wrappers";
import vue3GoogleLogin from "vue3-google-login";

export default boot(async ({ app }) => {
  app.use(vue3GoogleLogin, {
    clientId:
      "28731198002-knms6esusbgsg4m8mv07p2vqrvh9a4ej.apps.googleusercontent.com",
  });
});
