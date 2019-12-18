import Vue from "vue";
import Vuex from "vuex";
import config from "./modules/config";
import map from "./modules/map";
import fire from "./modules/fire";
import smoke from "./modules/smoke";
import population from "./modules/population";
import simulation from "./modules/simulation";
import output from "./modules/output";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    config,
    map,
    fire,
    smoke,
    population,
    simulation,
    output
  }
});
