// Population plans
// Used to store state of fire geojson and layers
import {
  START_LOADING,
  DONE_LOADING,
  SELECT_POPULATION,
  POP_ADD_SOURCE,
  POP_ADD_GEOJSON,
  POP_ADD_LAYER,
  CLEAR_POPULATION
} from "@/store/mutation-types";

const state = {
  selectedPopulation: null,
  loadedPopLayers: [],
  loadedPopSources: [],
  populationGeojson: []
};

const getters = {
  selectedPopulation: (state, getters) => {
    var pops = getters.populations;
    if (!pops) return null;

    if (state.selectedPopulation in pops) return pops[state.selectedPopulation];
    else return null;
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
        "circle-radius": {
          base: 1.75,
          stops: [[12, 2], [22, 180]]
        },
        "circle-color": {
          type: "identity",
          property: "color"
        }
      }
    };

    payload.map.addLayer(layer, payload.beforeLayer);
    state.loadedPopLayers.push(popSlice.layerName);
  },
  [POP_ADD_GEOJSON](state, payload) {
    state.populationGeojson.push(payload);
  },
  [CLEAR_POPULATION](state, map) {
    // remove layers
    for (const layer of state.loadedPopLayers) map.removeLayer(layer);
    state.loadedPopLayers = [];
    // remove sources
    for (const source of state.loadedPopSources) map.removeSource(source);
    state.loadedPopSources = [];

    // remove animation states
    state.populationGeojson = [];
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
      dispatch(
        "fetchPopulation",
        process.env.VUE_APP_EES_TILES_API + "/" + selectedPopulation.file
      );
    }
  },
  selectPopulation({ dispatch, commit, getters }, pop) {
    commit(SELECT_POPULATION, pop);
    var popData = getters.selectedPopulation;
    dispatch(
      "fetchPopulation",
      !popData ? "" : process.env.VUE_APP_EES_TILES_API + "/" + popData.file
    );
  },
  fetchPopulation({ dispatch, commit, rootGetters }, url) {
    const map = rootGetters.mapInstance;
    commit(CLEAR_POPULATION, map);
    commit(START_LOADING);

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
        dispatch("filterFire", totalSteps - 1); // load the final fire step
        commit(DONE_LOADING);
      });
  },
  filterFire({ getters }, fireStep) {
    var map = getters.mapInstance;

    const s = map.getSource("pop-source");
    if (typeof s !== "undefined") {
      s.setData(window.populationGeojson[fireStep]);
    }
  },
  resetFireLayers({ rootGetters, getters, commit }) {
    var map = rootGetters.mapInstance;
    var totalFireLayers = getters.totalPopLayers;
    var i;
    var layer;

    // we dont want to clear, just reset each fire layer
    for (i = 0; i < totalFireLayers; i++) {
      layer = "pop-layer";
      map.removeLayer(layer);
    }
    state.loadedPopLayers = [];

    for (i = 0; i < totalFireLayers; i++) {
      var source = "pop-source";
      layer = "pop-layer";

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
