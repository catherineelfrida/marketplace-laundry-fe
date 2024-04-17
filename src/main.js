import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
import notifications from '@kyvg/vue3-notification'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'dotenv/config'

const appInstance = createApp(App);
library.add(fas);

appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.use(notifications)
appInstance.component('font-awesome-icon', FontAwesomeIcon);
appInstance.mount("#app");
