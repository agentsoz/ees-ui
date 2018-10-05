import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    map: null,
    mapboxStyle: "mapbox://styles/mapbox/dark-v9"
  },
  getters: {
    map: state => state.map,
    mapboxStyle: state => state.mapboxStyle
  },
  mutations: {
    setMap(newMap) {
      this.map = newMap;
    },
    setStyle(newStyle) {
      this.mapboxStyle = newStyle;
    }
  },
  actions: {}
});
