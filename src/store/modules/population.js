// Population plans
// Used to store state of fire geojson and layers
import {
  START_LOADING,
  DONE_LOADING,
  SELECT_POPULATION,
  POPULATION_SET_OPACITY,
  POP_SET_ACTIVITIES,
  POP_SET_ACTIVITY_COLOR,
  POP_ADD_SOURCE,
  POP_ADD_LAYER,
  CLEAR_POPULATION
} from "@/store/mutation-types";

const namespaced = true; // https://vuex.vuejs.org/guide/modules.html#namespacing

const state = {
  selected: null,
  loadedLayers: [],
  loadedSources: [],
  opacity: 1.0,
  activityColors: [
    "#fbb03b",
    "#223b53",
    "#e55e5e",
    "#3bb2d0",
    "#cccccc" // must be 6 hex, due to reactive colorpicker feedback loops. more may be required
  ],
  currActivities: {}
};

const getters = {
  selected: (state, getters, rootState, rootGetters) => {
    const all = rootGetters.populations;
    if (!all) return null;

    if (state.selected in all) return all[state.selected];
    else return null;
  },
  currActivities: state => state.currActivities,
  description: (state, getters) => {
    if (getters.selected !== null) {
      return getters.selected.description;
    } else return "";
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
    state.opacity = value;
  },
  [POP_SET_ACTIVITIES](state, activities) {
    var currActivities = {};
    activities.sort();

    for (var i = 0; i < activities.length; i++) {
      if (i < state.activityColors.length) {
        currActivities[activities[i]] = state.activityColors[i];
      } else {
        // seeded colour generator
        var color = Math.floor(Math.abs(Math.sin(i) * 16777215) % 16777215);
        color = color.toString(16);
        // pad any colors shorter than 6 characters with leading 0s
        while (color.length < 6) {
          color = "0" + color;
        }
        currActivities[activities[i]] = "#" + color;
				state.activityColors.push("#" + color);
      }
    }
    state.currActivities = currActivities;
  },
  [POP_SET_ACTIVITY_COLOR](state, { id, color }) {
    if (state.activityColors[id] != color) {
      state.activityColors[id] = color;
    }
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
    state.currActivities = {};
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
    if (getters.selected) {
      dispatch("load");

      // handle the case where the population has been selected without selecting a region
      if (rootGetters.selectedRegion == null && getters.selected.tags)
        dispatch("selectRelevantRegion", getters.selected.tags, { root: true });
    }
  },
  // Used in Map.vue by loadLayersOnStyleChange.
  // Adds both source and layers back to the map in the event of a style change
  // Must be implemented by any module that
  // adds sources/layers to mapbox.
  loadGlobal: {
    root: true,
    handler({ dispatch }) {
      dispatch("load");
    }
  },
  load({ dispatch, getters }) {
    if (getters.selected) {
      dispatch(
        "downloadAndCreateLayers",
        process.env.VUE_APP_EES_TILES_API + "/" + getters.selected.file
      );
    }
  },
  downloadAndCreateLayers({ state, dispatch, commit, rootGetters }, url) {
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
        // json is sorted by end_time
        // we can efficiently set up sources
        const lastFeature = json[json.length - 1];
        const totalMinutes = lastFeature.end_hr * 60;
        const totalSteps = Math.ceil(
          totalMinutes / rootGetters["fire/stepMinutes"]
        );

        var whereareyounow = {};
        var currActivities = [];

        // a first sweep to determine where everyone starts
        // and total activity types
        for (const plan of json) {
          if (!(plan.id in whereareyounow)) {
            whereareyounow[plan.id] = plan;
          }
          if (!currActivities.includes(plan.type)) {
            currActivities.push(plan.type);
          }
        }

        commit(POP_SET_ACTIVITIES, currActivities);

        // this will track the geojson features array
        var j = 0;
        // skip nulls
        // generate a geojson object for each step
        for (var i = 0; i < totalSteps; i++) {
          // set a threshold
          var threshold = (i * rootGetters["fire/stepMinutes"]) / 60;

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
                color: state.currActivities[whereareyounow[k].type]
              },
              geometry: {
                type: "Point",
                coordinates: [whereareyounow[k].x, whereareyounow[k].y]
              }
            };
            sect.features.push(feature);
          }

          window.populationGeojson.push(sect);
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
          beforeLayer: rootGetters.featureSetPlaceholderLayerId["population"],
          popSlice: {
            sourceName: source,
            layerName: layer
          }
        });
        dispatch("filter", totalSteps - 1, { root: true }); // load the final fire step
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
  changeActivityColor({ state, dispatch, commit }, { id, color }) {
		if (state.activityColors[id] != color) {
			commit(POP_SET_ACTIVITY_COLOR, { id, color });
			dispatch("select", state.selected);
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
