import Vue from "vue";
import Vuex from "vuex";
import Map from "@/components/Map";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    map: null,
    mapboxStyle: "dark",
    mapCenter: [144.068722, -36.997609], // Maldon VIC
    mapSettingsIsOpen: false,
    reloadOverlayLayersOnStyleData: false,
    matsimNetworkLayer: "mount_alexander_shire_networkP",
    fireGeoJson:
      "https://raw.githubusercontent.com/agentsoz/ees/master/scenarios/mount-alexander-shire/maldon-100-with-emergency-vehicles/scenario_fire.json"
  },
  getters: {
    map: state => state.map,
    mapboxStyle: state => state.mapboxStyle,
    mapCenter: state => state.mapCenter,
    mapSettingsIsOpen: state => state.mapSettingsIsOpen,
    matsimNetworkLayer: state => state.matsimNetworkLayer,
    fireGeoJson: state => state.fireGeoJson,
    reloadOverlayLayersOnStyleData: state => state.reloadOverlayLayersOnStyleData
  },

  mutations: {
    setMap(state, newMap) {
      state.map = newMap;
    },
    setMapboxStyle(state, newStyle) {
      state.mapboxStyle = newStyle;
      state.map.setStyle("mapbox://styles/mapbox/" + state.mapboxStyle + "-v9");
      state.reloadOverlayLayersOnStyleData = true;
      //Map.methods.addMATSimNetworkLayer(state.map, state.matsimNetworkLayer);
      //Map.methods.addFireLayer(state.map, state.fireGeoJson);
    },
    setMapSettingsIsOpen(state, newVal) {
      state.mapSettingsIsOpen = newVal;
    },
    setReloadOverlayLayersOnStyleData(state, newVal) {
      state.reloadOverlayLayersOnStyleData = newVal;
    }
  },
  actions: {}
});
