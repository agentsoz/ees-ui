// Population plans
// Used to store state of fire geojson and layers
import {
  START_LOADING,
  DONE_LOADING,
  SELECT_POPULATION,
  POPULATION_SET_OPACITY,
  POP_ADD_SOURCE,
  POP_ADD_GEOJSON,
  POP_ADD_LAYER,
  CLEAR_POPULATION
} from "@/store/mutation-types";

const namespaced = true; // https://vuex.vuejs.org/guide/modules.html#namespacing

const state = {
  selected: null,
  loadedLayers: [],
  loadedSources: [],
  populationGeojson: [],
  popOpacity: 1.0
};

const getters = {
  selected: (state, getters, rootState, rootGetters) => {
    const all = rootGetters.populations;
    if (!all) return null;

    if (state.selected in all) return all[state.selected];
    else return null;
  },
  totalLayers: state => state.loadedLayers.length,
  aboveLayer: (state, getters, rootState) => {
    return rootState.firstSymbolLayer;
  }
};

const mutations = {
  [SELECT_POPULATION](state, newVal) {
    state.selected = newVal;
  },
  [POPULATION_SET_OPACITY](state, value) {
    state.fireOpacity = value;
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
        "circle-color": {
          type: "identity",
          property: "color"
        },
        "circle-opacity": state.popOpacity,
        "circle-opacity-transition": {
          duration: 0
        }
      }
    };

    payload.map.addLayer(layer, payload.beforeLayer);
    state.loadedLayers.push(popSlice.layerName);
  },
  [POP_ADD_GEOJSON](state, payload) {
    state.populationGeojson.push(payload);
  },
  [CLEAR_POPULATION](state, map) {
    // remove layers
    for (const layer of state.loadedLayers) map.removeLayer(layer);
    state.loadedLayers = [];
    // remove sources
    for (const source of state.loadedSources) map.removeSource(source);
    state.loadedSources = [];

    // remove animation states
    state.populationGeojson = [];

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
    commit(SELECT_POPULATION, pop);
    if (getters.selected)
      dispatch("load");
    else
      commit(CLEAR_POPULATION, rootGetters.mapInstance);
  },
  load({ dispatch, getters }) {
    if (getters.selected) {
      dispatch(
        "downloadAndCreateLayers",
        process.env.VUE_APP_EES_TILES_API + "/" + getters.selected.file
      );
    }
  },
  downloadAndCreateLayers({ dispatch, commit, rootGetters }, url) {
    const map = rootGetters.mapInstance;
    commit(CLEAR_POPULATION, map);
    commit(START_LOADING, null, { root: true });

    window.populationGeojson = [];

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

        var activityColors = {
          home: "#fbb03b",
          work: "#223b53",
          beach: "#e55e5e",
          shops: "#3bb2d0",
          other: "#ccc"
        };

        var whereareyounow = {};

        // a first sweep to determine where everyone starts
        for (const plan of json) {
          if (!(plan.id in whereareyounow)) {
            whereareyounow[plan.id] = plan;
          }
        }

        // this will track the geojson features array
        var j = 0;
        // skip nulls
        // generate a geojson object for each step
        for (var i = 0; i < totalSteps; i++) {
          // set a threshold
          var threshold = (i * rootGetters.fireStepMinutes) / 60;

          // add all features below the minutes threshold to this structure
          while (json[j].end_hr < threshold) {
            whereareyounow[json[j].id] = json[j];
            j++;
          }

          // create a fresh geojson structure for this layer
          var sect = {
            type: "FeatureCollection",
            features: []
          };

          // we know the state of everyone at this time, create a feature for each person
          for (const k of Object.keys(whereareyounow)) {
            var feature = {
              type: "Feature",
              properties: {
                person: whereareyounow[k].id,
                end_hr: whereareyounow[k].end_hr,
                type: whereareyounow[k].type,
                color: activityColors[whereareyounow[k].type]
              },
              geometry: {
                type: "Point",
                coordinates: [whereareyounow[k].x, whereareyounow[k].y]
              }
            };
            sect.features.push(feature);
          }

          window.populationGeojson.push(sect);
          // save this data for animation later
          //commit(POP_ADD_GEOJSON, sect);
        }

        // create a single layer to conduct animation in
        var layer = "pop-layer";
        var source = "pop-source";
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
        dispatch("filterFire", totalSteps - 1, { root: true }); // load the final fire step
        commit(DONE_LOADING, null, { root: true });
      });
  },
  filter: {
    root: true,
    handler({ rootGetters }, fireStep) {
      const map = rootGetters.mapInstance;

      const s = map.getSource("pop-source");
      if (typeof s !== "undefined") {
        s.setData(window.populationGeojson[fireStep]);
      }
    }
  },
  setOpacity({ rootGetters, commit }, val) {
    var map = rootGetters.mapInstance;
    var layer = "pop-layer";

    commit(POPULATION_SET_OPACITY, val);
    map.setPaintProperty(layer, "circle-opacity", val);
  },
  reload: {
    root: true,
    handler({ rootGetters, commit }) {
      var map = rootGetters.mapInstance;
      var layer;

      // we dont want to clear, just reset each layer
      layer = "pop-layer";
      map.removeLayer(layer);
      state.loadedLayers = [];

      var source = "pop-source";

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
