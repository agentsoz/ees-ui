import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mapboxStyle: "mapbox://styles/mapbox/dark-v9"
  },
  getters: {
    mapboxStyle: state => state.mapboxStyle
  },
  mutations: {},
  actions: {}
});
