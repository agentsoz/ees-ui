// Phoenix smoke
// Used to store state of smoke geojson and layers
// Smoke data is related to the fire and time slider, therefore we
// piggyback a number of fire vuex actions here

import {
  START_LOADING,
  DONE_LOADING,
  DRAW_SMOKE,
  EMBER_ADD_SOURCE,
  EMBER_ADD_LAYER,
  EMBER_SET_OPACITY,
  CLEAR_SMOKE
} from "@/store/mutation-types";

const state = {
  smokeVisible: false,
  loadedSmokeLayers: [],
  loadedSmokeSources: [],
  smokeOpacity: 0.4,
  smokeIntensityLevels: [[0, "#333333"], [100000, "#000000"]]
};

const getters = {
  totalSmokeLayers: state => state.loadedSmokeLayers.length
};

const mutations = {
  [DRAW_SMOKE](state, newVal) {
    state.smokeVisible = newVal;
  },
  [EMBER_ADD_SOURCE](state, payload) {
    var smokeSlice = payload.smokeSlice;
    var source = smokeSlice.sourceName;

    // setup unique source
    payload.map.addSource(source, {
      type: "geojson",
      data: smokeSlice.geojson
    });
    state.loadedSmokeSources.push(source);
  },
  [EMBER_ADD_LAYER](state, payload) {
    var smokeSlice = payload.smokeSlice;
    var layer;
    layer = {
      id: smokeSlice.layerName,
      type: "fill",
      source: smokeSlice.sourceName,
      layout: {
        visibility: "none"
      },
      paint: {
        "fill-color": {
          property: "E_INTSTY",
          stops: state.smokeIntensityLevels
        },
        "fill-opacity": state.smokeOpacity
      }
    };

    payload.map.addLayer(layer, payload.beforeLayer);
    state.loadedSmokeLayers.push(smokeSlice.layerName);
  },
  [EMBER_SET_OPACITY](state, value) {
    state.smokeOpacity = value;
  },
  [CLEAR_SMOKE](state, map) {
    // remove layers
    for (const layer of state.loadedSmokeLayers) map.removeLayer(layer);
    state.loadedSmokeLayers = [];
    // remove sources
    for (const source of state.loadedSmokeSources) map.removeSource(source);
    state.loadedSmokeSources = [];
  }
};

const actions = {
  clearMap({ commit, rootGetters }) {
    // ensure any existing smoke artifacts are removed
    commit(CLEAR_SMOKE, rootGetters.mapInstance);
  },
  loadLayers({ dispatch }) {
    dispatch("drawSmoke");
  },
  fetchSmoke({ dispatch, commit, getters, rootGetters }, url) {
    const map = rootGetters.mapInstance;
    commit(CLEAR_SMOKE, map);
    commit(START_LOADING);

    // download and pre-process the geojson for better performance while rendering
    // we will build our own sources and layers for each smoke step
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(geojson) {
        var features = geojson.features;
        // first sort
        features.sort(function(a, b) {
          if (a.properties.hour_spot === null) return -1;
          if (b.properties.hour_spot === null) return 1;
          else return a.properties.hour_spot - b.properties.hour_spot;
        });
        // now we can efficiently set up sources
        const lastFeature = features[features.length - 1];
        const totalMinutes = lastFeature.properties.hour_spot * 60;
        const totalSteps = Math.ceil(
          totalMinutes / rootGetters.fireStepMinutes
        );

        // this will track the geojson features array
        var j = 0;
        // skip nulls
        while (features[j].properties.hour_spot === null) j++;
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
          while (features[j].properties.hour_spot < threshold) {
            sect.features.push(features[j]);
            j++;
          }

          // create this layer
          var stepStr = i.toString();
          var layer = "ember-layer" + stepStr;
          var source = "ember-source" + stepStr;
          commit(EMBER_ADD_SOURCE, {
            map: map,
            smokeSlice: {
              sourceName: source,
              geojson: sect
            }
          });
          commit(EMBER_ADD_LAYER, {
            map: map,
            beforeLayer: getters.smokeBeforeLayer,
            smokeSlice: {
              sourceName: source,
              layerName: layer
            }
          });
        }
        dispatch("filterFire", rootGetters.visibleFireStep); // load the final smoke step
        commit(DONE_LOADING);
      });
  },
  drawSmoke({ state, dispatch, rootGetters }) {
    // called by selectFire after selecting a fire
    // we have the smoke data for this fire
    var selectedFire = rootGetters.selectedFire;
    // check there is a fire selected and we want smoke to be visible
    if (selectedFire && selectedFire.smokeGeojson && state.smokeVisible) {
      dispatch("fetchSmoke", selectedFire.smokeGeojson);
    }
  },
  filterFire({ getters }, smokeStep) {
    var map = getters.mapInstance;

    // ensure every layer before the current step is on, and every one after is off
    for (var i = 0; i < getters.totalSmokeLayers; i++) {
      var layer = "ember-layer" + i.toString();
      if (i <= smokeStep) map.setLayoutProperty(layer, "visibility", "visible");
      else map.setLayoutProperty(layer, "visibility", "none");
    }
  },
  resetFireLayers({ dispatch, rootGetters, getters, commit }) {
    var map = rootGetters.mapInstance;
    var totalSmokeLayers = getters.totalSmokeLayers;
    var i;
    var step;
    var layer;

    // we dont want to clear, just reset each smoke layer
    for (i = 0; i < totalSmokeLayers; i++) {
      step = i.toString();
      layer = "ember-layer" + step;
      map.removeLayer(layer);
    }
    state.loadedSmokeLayers = [];

    for (i = 0; i < totalSmokeLayers; i++) {
      step = i.toString();
      var source = "ember-source" + step;
      layer = "ember-layer" + step;

      commit(EMBER_ADD_LAYER, {
        map: map,
        smokeSlice: {
          sourceName: source,
          layerName: layer
        }
      });
    }
    dispatch("filterFire", rootGetters.visibleFireStep);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
