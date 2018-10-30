import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mapboxStyle: "dark",
    mapCenter: [144.068722, -36.997609], // Maldon VIC
    mapSettingsIsOpen: false,
    selectedRegion: null,
    selectedFire: null,
    reloadOverlayLayersOnStyleData: false,
    fireGeoJson:
      "https://raw.githubusercontent.com/agentsoz/ees/master/scenarios/mount-alexander-shire/maldon-100-with-emergency-vehicles/scenario_fire.json",
    map: {
      instance: null,
      center: [144.968447, -37.818232], // Federeation Square Melbourne
      styles: [
        {
          id: "basic",
          name: "Basic"
        },
        {
          id: "bright",
          name: "Bright"
        },
        {
          id: "dark",
          name: "Dark"
        },
        {
          id: "light",
          name: "Light"
        },
        {
          id: "satellite",
          name: "Satellite"
        },
        {
          id: "streets",
          name: "Streets"
        }
      ]
    },
    regions: [
      {
        id: "Mount_Alexander_Shire",
        name: "Mount Alexander Shire",
        center: [144.212304, -37.064737], // Castlemaine VIC
        matsimNetworkLayer: "mount_alexander_shire_networkP",
        matsimNetworkTiles:
          "https://ees-server.now.sh/matsim-tiles/mount-alexander-shire/{z}/{x}/{y}.pbf",
        phoenixRuns: [
          {
            id: "20160420_MtAlexShire_FDI50_Iso",
            name: "20160420 Maldon FFDI50 ISO",
            description:
              "Forest Fire Danger Index (FFDI) 50 with south west wind change; based on 11:00 point fire ignition and running until 18:00",
            geojson:
              "https://raw.githubusercontent.com/agentsoz/ees/72222359e6418bf491b8176ab47586dcbd551bc5/scenarios/mount-alexander-shire/app-data/maldon/20160420_MtAlexShire_FDI50_Iso.json"
          },
          {
            id: "20160420_MtAlexShire_FDI75_Iso",
            name: "20160420 Maldon FFDI75 ISO",
            description:
              "Forest Fire Danger Index (FFDI) 75 with south west wind change; based on 11:00 point fire ignition and running until 18:00",
            geojson:
              "https://raw.githubusercontent.com/agentsoz/ees/72222359e6418bf491b8176ab47586dcbd551bc5/scenarios/mount-alexander-shire/app-data/maldon/20160420_MtAlexShire_FDI75_Iso.json"
          }
        ]
      },
      {
        id: "Surf_Coast_Shire",
        name: "Surf Coast Shire",
        center: [144.326271, -38.332386], // Torquay Esplanade
        matsimNetworkLayer: "surf_coast_shire_networkP",
        matsimNetworkTiles:
          "https://ees-server.now.sh/matsim-tiles/surf-coast-shire/{z}/{x}/{y}.pbf",
        phoenixRuns: [
          {
            id:
              "Anglesea_evac_test_ffdi104_phx5_2016data_minsup_fh2017_grid_WSG84",
            name: "Anglesea_FFDI104 PHX5 2016 MINSUP FH2017 GRID",
            description: "12:00 point fire ignition",
            geojson:
              "https://raw.githubusercontent.com/agentsoz/ees/f25dd3427060180f08716c25198d5b6e0e530fd9/scenarios/surf-coast-shire/data/phoenix/Anglesea_evac_test_ffdi104_phx5_2016data_minsup_fh2017_grid_WSG84.json"
          }
        ]
      }
    ]
  },
  getters: {
    map: state => state.map,
    mapInstance: state => state.map.instance,
    mapboxStyle: state => state.mapboxStyle,
    mapCenter: state => state.mapCenter,
    mapSettingsIsOpen: state => state.mapSettingsIsOpen,
    matsimNetworkLayer: state => state.matsimNetworkLayer,
    selectedRegion: state => state.selectedRegion,
    selectedFire: state => state.selectedFire,
    regions: state => state.regions,
    fireGeoJson: state => state.fireGeoJson,
    reloadOverlayLayersOnStyleData: state =>
      state.reloadOverlayLayersOnStyleData,
    region: state => regionId => {
      return state.regions.find(region => region.id === regionId);
    },
    firesInSelectedRegion: (state, getters) => {
      if (!state.selectedRegion) {
        return null;
      }
      var regionX = getters.region(state.selectedRegion);
      return regionX.phoenixRuns;
    },
    selectedFireData: (state, getters) => {
      var fires = getters.firesInSelectedRegion;
      if (!fires) {
        return null;
      }
      var fire = fires.find(obj => obj.id === state.selectedFire);
      return fire;
    }
  },

  mutations: {
    setMapInstance(state, newMap) {
      state.map.instance = newMap;
    },
    setMapboxStyle(state, newStyle) {
      state.mapboxStyle = newStyle;
      state.map.instance.setStyle(
        "mapbox://styles/mapbox/" + state.mapboxStyle + "-v9"
      );
      state.reloadOverlayLayersOnStyleData = true;
    },
    setMapSettingsIsOpen(state, newVal) {
      state.mapSettingsIsOpen = newVal;
    },
    setReloadOverlayLayersOnStyleData(state, newVal) {
      state.reloadOverlayLayersOnStyleData = newVal;
    },
    setSelectedRegion(state, newVal) {
      state.selectedRegion = newVal;
    },
    setSelectedFire(state, newVal) {
      state.selectedFire = newVal;
    }
  },
  actions: {}
});
