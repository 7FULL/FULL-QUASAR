import { boot } from "quasar/wrappers";
import { VueRecaptchaPlugin } from "vue-recaptcha/head";

export default boot(async ({ app }) => {
  // something to do
  app.use(VueRecaptchaPlugin, {
    v2SiteKey: "6Lc9z9EmAAAAAEMtU3tyFP2wGTJf2slUMaDL_P6t",
    v3SiteKey: "6Lc099EmAAAAAI_Ra6YRJ35X0FjthvtuXyH0X8E9",
  });
});
