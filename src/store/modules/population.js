// Population plans
// Used to store state of fire geojson and layers
import {
  START_LOADING,
  DONE_LOADING,
  SELECT_POPULATION,
  POP_ADD_SOURCE,
  POP_ADD_LAYER,
  CLEAR_POPULATION
} from "@/store/mutation-types";

const state = {
  selectedPopulation: null,
  loadedPopLayers: [],
  loadedPopSources: []
};

const getters = {
  selectedPopulation: (state, getters) => {
    var pops = getters.popInSelectedRegion;
    if (!pops) return null;

    var pop = pops.find(obj => obj.id === state.selectedPopulation);
    return pop;
  },
  totalPopLayers: state => state.loadedPopLayers.length,
  popAboveLayer: (state, getters, rootState) => {
    return rootState.firstSymbolLayer;
  }
};

const mutations = {
  [SELECT_POPULATION](state, newVal) {
    state.selectedPopulation = newVal;
  },
  [POP_ADD_SOURCE](state, payload) {
    var popSlice = payload.popSlice;
    var source = popSlice.sourceName;

    // setup unique source
    payload.map.addSource(source, {
      type: "geojson",
      data: popSlice.geojson
    });
    state.loadedPopSources.push(source);
  },
  [POP_ADD_LAYER](state, payload) {
    var popSlice = payload.popSlice;
    var layer;
    layer = {
      id: popSlice.layerName,
      type: "circle",
      source: popSlice.sourceName,
      paint: {
        "circle-radius": 1,
        "circle-color": "#ff0000"
      }
    };

    payload.map.addLayer(layer, payload.beforeLayer);
    state.loadedPopLayers.push(popSlice.layerName);
  },
  [CLEAR_POPULATION](state, map) {
    // remove layers
    for (const layer of state.loadedPopLayers) map.removeLayer(layer);
    state.loadedPopLayers = [];
    // remove sources
    for (const source of state.loadedPopSources) map.removeSource(source);
    state.loadedPopSources = [];
  }
};

const actions = {
  clearMap({ commit, rootGetters }) {
    // ensure any existing matsim/fire artifacts are removed
    commit(CLEAR_POPULATION, rootGetters.mapInstance);
  },
  loadLayers({ dispatch, getters }) {
    var selectedPopulation = getters.selectedPopulation;
    if (selectedPopulation) {
      dispatch("fetchPopulation", selectedPopulation.data);
    }
  },
  selectPopulation({ dispatch, commit, getters }, pop) {
    commit(SELECT_POPULATION, pop);
    var popData = getters.selectedPopulation;
    dispatch("fetchPopulation", !popData ? "" : popData.data);
  },
  fetchPopulation({ dispatch, commit, getters, rootGetters }, url) {
    const map = rootGetters.mapInstance;
    commit(CLEAR_POPULATION, map);
    commit(START_LOADING);

    // download and pre-process the geojson for better performance while rendering
    // we will build our own sources and layers for each fire step
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        // json is sorted by end_time
        // we can efficiently set up sources
        const lastFeature = json[json.length - 1];
        const totalMinutes = lastFeature.end_hr * 60;
        const totalSteps = Math.ceil(
          totalMinutes / rootGetters.fireStepMinutes
        );

        // this will track the geojson features array
        var j = 0;
        // skip nulls
        // generate a geojson object for each step
        for (var i = 0; i < totalSteps; i++) {
          // set a threshold
          var threshold = (i * rootGetters.fireStepMinutes) / 60;
          // create a fresh geojson structure for this layer
          var sect = {
            type: "FeatureCollection",
            features: []
          };

          // add all features below the minutes threshold to this structure
          while (json[j].end_hr < threshold) {
            var feature = {
              type: "Feature",
              properties: {
                person: json[j].person,
                end_hr: json[j].end_hr,
                type: json[j].type
              },
              geometry: {
                type: "Point",
                coordinates: [json[j].x, json[j].y]
              }
            };
            sect.features.push(feature);
            j++;
          }

          // create this layer
          var stepStr = i.toString();
          var layer = "pop-layer" + stepStr;
          var source = "pop-source" + stepStr;
          commit(POP_ADD_SOURCE, {
            map: map,
            popSlice: {
              sourceName: source,
              geojson: sect
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
        }
        //dispatch("filterFire", totalSteps - 1); // load the final fire step
        commit(DONE_LOADING);
      });
  },
  filterFire({ getters, rootGetters, commit }, fireStep) {
    var map = getters.mapInstance;

    // ensure every layer other than the current step is off
    for (var i = 0; i < rootGetters.totalFireLayers; i++) {
      var layer = "pop-layer" + i.toString();
      if (i == fireStep) map.setLayoutProperty(layer, "visibility", "visible");
      else map.setLayoutProperty(layer, "visibility", "none");
    }
  },
  resetFireLayers({ dispatch, rootGetters, getters, commit }) {
    var map = rootGetters.mapInstance;
    var totalFireLayers = getters.totalPopLayers;
    var i;
    var step;
    var layer;

    // we dont want to clear, just reset each fire layer
    for (i = 0; i < totalFireLayers; i++) {
      step = i.toString();
      layer = "pop-layer" + step;
      map.removeLayer(layer);
    }
    state.loadedPopLayers = [];

    for (i = 0; i < totalFireLayers; i++) {
      step = i.toString();
      var source = "pop-source" + step;
      layer = "pop-layer" + step;

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
  state,
  getters,
  mutations,
  actions
};
