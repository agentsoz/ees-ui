import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import VueMq from "vue-mq";
Vue.use(VueMq);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
  mounted: function() {
    this.$store.dispatch(
      "getConfig",
      process.env.VUE_APP_EES_TILES_API + "/config"
    );
  }
}).$mount("#app");
