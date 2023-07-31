import { boot } from "quasar/wrappers";
import vue3GoogleLogin from "vue3-google-login";

export default boot(async ({ app }) => {
  app.use(vue3GoogleLogin, {
    clientId:
      "28731198002-b1rgipsil1hioku0998eu1gpvvqh6dvo.apps.googleusercontent.com",
  });
});
