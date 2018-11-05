import Vue from "vue";
import Vuex from "vuex";
import config from "./modules/config"
import map from "./modules/map"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    config,
    map
  }
    
});
