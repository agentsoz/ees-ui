// Output playthrough
//
import {
  START_LOADING,
  DONE_LOADING,
  SELECT_POPULATION,
  POPULATION_SET_OPACITY,
  POP_ADD_SOURCE,
  POP_ADD_LAYER,
  CLEAR_POPULATION
} from "@/store/mutation-types";

const namespaced = true; // https://vuex.vuejs.org/guide/modules.html#namespacing

const state = {
  stepMinutes: 1,
  visibleStep: 0,
  selected: null,
  loadedLayers: [],
  loadedSources: [],
  opacity: 1.0,
  activityColors: {
    home: "#fbb03b",
    work: "#223b53",
    beach: "#e55e5e",
    shops: "#3bb2d0",
    other: "#ccc"
  }
};

const getters = {
  selected: (state, getters, rootState, rootGetters) => {
    const all = rootGetters.populations;
    if (!all) return null;

    if (state.selected in all) return all[state.selected];
    else return null;
  },
  description: (state, getters) => {
    if (state.selected) {
      return getters.selected.description;
    } else return "";
  },
  totalLayers: state => state.loadedLayers.length,
  aboveLayer: (state, getters, rootState) => {
    return rootState.firstSymbolLayer;
  }
};

const mutations = {
  ["SET_VISIBLE_STEP"](state, newVal) {
    state.visibleStep = newVal;
  },
  [SELECT_POPULATION](state, newVal) {
    state.selected = newVal;
  },
  [POPULATION_SET_OPACITY](state, value) {
    state.opacity = value;
  },
  [POP_ADD_SOURCE](state, payload) {
    var popSlice = payload.popSlice;
    var source = popSlice.sourceName;

    // setup unique source
    payload.map.addSource(source, {
      type: "geojson",
      data: popSlice.geojson
    });
    state.loadedSources.push(source);
  },
  [POP_ADD_LAYER](state, payload) {
    var popSlice = payload.popSlice;
    var layer;
    layer = {
      id: popSlice.layerName,
      type: "circle",
      source: popSlice.sourceName,
      paint: {
        "circle-radius": {
          base: 1.75,
          stops: [[12, 2], [22, 180]]
        },
        "circle-color": "#ffffff",
        "circle-opacity": state.opacity,
        "circle-opacity-transition": {
          duration: 0
        }
      }
    };

    payload.map.addLayer(layer, payload.beforeLayer);
    state.loadedLayers.push(popSlice.layerName);
  },
  [CLEAR_POPULATION](state, map) {
    // remove layers
    for (const layer of state.loadedLayers) map.removeLayer(layer);
    state.loadedLayers = [];
    // remove sources
    for (const source of state.loadedSources) map.removeSource(source);
    state.loadedSources = [];

    // remove animation states
    delete window.populationGeojson;

    state.selected = null;
  }
};

const actions = {
  clearMap: {
    // Every store module is responsible for cleaning up after itself
    // https://vuex.vuejs.org/guide/modules.html#register-global-action-in-namespaced-modules
    root: true,
    handler({ commit, rootGetters }) {
      // ensure any existing matsim/fire artifacts are removed
      commit(CLEAR_POPULATION, rootGetters.mapInstance);
    }
  },
  select({ dispatch, getters, rootGetters, commit }, pop) {
    commit(CLEAR_POPULATION, rootGetters.mapInstance);
    commit(SELECT_POPULATION, pop);
    if (getters.selected) dispatch("load");
  },
  // Used in Map.vue by loadLayersOnStyleChange.
  // Adds both source and layers back to the map in the event of a style change
  // Must be implemented by any module that
  // adds sources/layers to mapbox.
  loadGlobalOff: {
    root: true,
    handler({ dispatch }) {
      dispatch("load");
    }
  },
  load({ dispatch }) {
    dispatch(
      "downloadAndCreateLayers",
      process.env.VUE_APP_EES_TILES_API + "/populations/link_entry_frames.json"
    );
  },
  downloadAndCreateLayers({ dispatch, commit, rootGetters }, url) {
    const map = rootGetters.mapInstance;
    commit(START_LOADING, null, { root: true });

    // the vuex state cant handle large datastructures
    window.populationGeojson = [];

    // download and pre-process the geojson for better performance while rendering
    // we will build our own sources and layers for each fire step
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        window.populationGeojson = json;

        // create a single layer to conduct animation in
        var layer = "output-layer";
        var source = "output-source";
        commit(POP_ADD_SOURCE, {
          map: map,
          popSlice: {
            sourceName: source,
            geojson: window.populationGeojson[0]
          }
        });
        commit(POP_ADD_LAYER, {
          map: map,
          beforeLayer: rootGetters.fireBeforeLayer,
          popSlice: {
            sourceName: source,
            layerName: layer
          }
        });
        dispatch("filter", json.length - 1, { root: true }); // load the final fire step
        commit(DONE_LOADING, null, { root: true });
      });
  },
  filter: {
    root: true,
    handler({ commit, rootGetters }, step) {
      commit("SET_VISIBLE_STEP", step);
      const map = rootGetters.mapInstance;

      const s = map.getSource("output-source");
      if (typeof s !== "undefined") {
        s.setData(window.populationGeojson[step]);
      }
    }
  },
  setOpacity({ rootGetters, commit }, val) {
    var map = rootGetters.mapInstance;
    var layer = "output-layer";

    commit(POPULATION_SET_OPACITY, val);
    map.setPaintProperty(layer, "circle-opacity", val);
  },
  reload: {
    root: true,
    handler({ rootGetters, commit }) {
      var map = rootGetters.mapInstance;
      var layer;

      // we dont want to clear, just reset each layer
      layer = "output-layer";
      map.removeLayer(layer);
      state.loadedLayers = [];

      var source = "output-source";

      commit(POP_ADD_LAYER, {
        map: map,
        popSlice: {
          sourceName: source,
          layerName: layer
        }
      });
    }
  }
};

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions
};
