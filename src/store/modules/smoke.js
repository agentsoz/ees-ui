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

const namespaced = true; // https://vuex.vuejs.org/guide/modules.html#namespacing

const state = {
  color: "#000000",
  visible: false,
  loadedLayers: [],
  loadedSources: [],
  opacity: 0.4
};

const getters = {
  totalLayers: state => state.loadedLayers.length
};

const mutations = {
  [DRAW_SMOKE](state, newVal) {
    state.visible = newVal;
  },
  [EMBER_ADD_SOURCE](state, payload) {
    var slice = payload.slice;
    var source = slice.sourceName;

    // setup unique source
    payload.map.addSource(source, {
      type: "geojson",
      data: slice.geojson
    });
    state.loadedSources.push(source);
  },
  [EMBER_ADD_LAYER](state, payload) {
    var slice = payload.slice;
    var layer;
    layer = {
      id: slice.layerName,
      type: "fill",
      source: slice.sourceName,
      layout: {
        visibility: "none"
      },
      paint: {
        "fill-color": state.color,
        "fill-opacity": state.opacity
      }
    };

    payload.map.addLayer(layer, payload.beforeLayer);
    state.loadedLayers.push(slice.layerName);
  },
  [EMBER_SET_OPACITY](state, value) {
    state.opacity = value;
  },
  [CLEAR_SMOKE](state, map) {
    // remove layers
    for (const layer of state.loadedLayers) map.removeLayer(layer);
    state.loadedLayers = [];
    // remove sources
    for (const source of state.loadedSources) map.removeSource(source);
    state.loadedSources = [];
  }
};

const actions = {
  clearMap: {
    root: true,
    handler({ commit, rootGetters }) {
      // ensure any existing smoke artifacts are removed
      commit(CLEAR_SMOKE, rootGetters.mapInstance);
    }
  },
  createLayers({ dispatch, commit, getters, rootGetters }, geojson) {
    const map = rootGetters.mapInstance;
    commit(CLEAR_SMOKE, map);
    commit(START_LOADING, null, { root: true });

    // pre-process the geojson for better performance while rendering
    // we will re-use the geojson from the phoenix fire load step
    // we will build our own sources and layers for each smoke step
    var features = [...geojson.features];
    // first sort
    features.sort(function(a, b) {
      if (a.properties.HOUR_SPOT === null) return -1;
      if (b.properties.HOUR_SPOT === null) return 1;
      else return a.properties.HOUR_SPOT - b.properties.HOUR_SPOT;
    });
    // now we can efficiently set up sources
    const lastFeature = features[features.length - 1];
    const totalMinutes = lastFeature.properties.HOUR_SPOT * 60;
    const totalSteps = Math.ceil(
      totalMinutes / rootGetters["fire/stepMinutes"]
    );

    // this will track the geojson features array
    var j = 0;
    // skip nulls
    while (features[j].properties.HOUR_SPOT === null) j++;
    // generate a geojson object for each step
    for (var i = 0; i < totalSteps; i++) {
      // set a threshold
      var threshold = (i * rootGetters["fire/stepMinutes"]) / 60;
      // create a fresh geojson structure for this layer
      var sect = {
        type: "FeatureCollection",
        features: []
      };

      // add all features below the minutes threshold to this structure
      while (features[j].properties.HOUR_SPOT < threshold) {
        sect.features.push(features[j]);
        j++;
      }

      // create this layer
      var stepStr = i.toString();
      var layer = "ember-layer" + stepStr;
      var source = "ember-source" + stepStr;
      commit(EMBER_ADD_SOURCE, {
        map: map,
        slice: {
          sourceName: source,
          geojson: sect
        }
      });
      commit(EMBER_ADD_LAYER, {
        map: map,
        beforeLayer: getters.smokeBeforeLayer,
        slice: {
          sourceName: source,
          layerName: layer
        }
      });
    }
    dispatch("filter", rootGetters["fire/visibleStep"], { root: true });
    commit(DONE_LOADING, null, { root: true });
  },
  filter: {
    root: true,
    handler({ state, getters, rootGetters }, step) {
      if (state.visible) {
        const map = rootGetters.mapInstance;
        const startStep = rootGetters["fire/startStep"];

        // ensure every layer before the current step is on, and every one after is off
        for (var i = 0; i < getters.totalLayers; i++) {
          var layer = "ember-layer" + i.toString();
          if (i + startStep <= step)
            map.setLayoutProperty(layer, "visibility", "visible");
          else map.setLayoutProperty(layer, "visibility", "none");
        }
      }
    }
  },
  toggle({ getters, rootGetters, commit, dispatch }, val) {
    commit(DRAW_SMOKE, val);
    if (val) {
      // filter to apply this change
      dispatch("filter", rootGetters["fire/visibleStep"], { root: true });
    } else {
      const map = rootGetters.mapInstance;
      // hide all smoke
      for (var i = 0; i < getters.totalLayers; i++) {
        var layer = "ember-layer" + i.toString();
        map.setLayoutProperty(layer, "visibility", "none");
      }
    }
  },
  setOpacity({ getters, rootGetters, commit }, val) {
    const map = rootGetters.mapInstance;
    const totalLayers = getters.totalLayers;
    var i;
    var step;
    var layer;
    commit(EMBER_SET_OPACITY, val);

    const paintProp = "fill-opacity";
    for (i = 0; i < totalLayers; i++) {
      step = i.toString();
      layer = "ember-layer" + step;
      map.setPaintProperty(layer, paintProp, val);
    }
  },
  reload: {
    root: true,
    handler({ rootGetters, getters, commit }) {
      const map = rootGetters.mapInstance;
      var totalLayers = getters.totalLayers;
      var i;
      var step;
      var layer;

      // we dont want to clear, just reset each smoke layer
      for (i = 0; i < totalLayers; i++) {
        step = i.toString();
        layer = "ember-layer" + step;
        map.removeLayer(layer);
      }
      state.loadedLayers = [];

      for (i = 0; i < totalLayers; i++) {
        step = i.toString();
        var source = "ember-source" + step;
        layer = "ember-layer" + step;

        commit(EMBER_ADD_LAYER, {
          map: map,
          slice: {
            sourceName: source,
            layerName: layer
          }
        });
      }
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
