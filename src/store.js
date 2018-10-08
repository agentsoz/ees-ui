import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    map: null,
    mapboxStyle: "mapbox://styles/mapbox/dark-v9",
    mapSettingsIsOpen: false
  },
  getters: {
    map: state => state.map,
    mapboxStyle: state => state.mapboxStyle,
    mapSettingsIsOpen: state => state.mapSettingsIsOpen
  },
  mutations: {
    setMap(state, newMap) {
      state.map = newMap;
    },
    setStyle(state, newStyle) {
      state.mapboxStyle = newStyle;
    },
    setMapSettingsIsOpen(state, newVal) {
      state.mapSettingsIsOpen = newVal;
    }
  },
  actions: {}
});
