// Phoenix fire
// Used to store state of fire geojson and layers

const state = {
  fireStepMinutes: 10,
  selectedFire: null,
  loadedFireLayers: [],
  loadedFireSources: [],
  visibleFireStep: null,
  fire3DFlameHeight: false,
  fireSliderTicks: true,
  fireOpacity: 0.4,
  fireIntensityLevels: [[0, "#ffc107"], [100000, "#dc3545"]]
};

const getters = {
  fireStepMinutes: state => state.fireStepMinutes,
  visibleFireStep: state => state.visibleFireStep,
  totalFireLayers: state => state.loadedFireLayers.length,
  selectedFire: (state, getters) => {
    var fires = getters.firesInSelectedRegion;
    if (!fires) return null;

    var fire = fires.find(obj => obj.id === state.selectedFire);
    return fire;
  },
  fireAboveLayer: (state, getters, rootState) => {
    return rootState.firstSymbolLayer
  }
};

const mutations = {
  setSelectedFire(state, newVal) {
    state.selectedFire = newVal;
  },
  addFireSource(state, payload) {
    var fireSlice = payload.fireSlice;
    var source = fireSlice.sourceName;

    // setup unique source
    payload.map.addSource(source, {
      type: "geojson",
      data: fireSlice.geojson
    });
    state.loadedFireSources.push(source);
  },
  addFireLayer(state, payload) {
    var fireSlice = payload.fireSlice;
    var layer;
    if (state.fire3DFlameHeight) {
      layer = {
        id: fireSlice.layerName,
        type: "fill-extrusion",
        source: fireSlice.sourceName,
        filter: ["has", "FLAME_HT"],
        layout: {
          visibility: "none"
        },
        paint: {
          "fill-extrusion-color": {
            property: "E_INTSTY",
            stops: state.fireIntensityLevels
          },
          "fill-extrusion-height": {
            property: "FLAME_HT",
            stops: [[0, 1], [300, 1000]]
          },
          "fill-extrusion-base": 0,
          "fill-extrusion-opacity": state.fireOpacity
        }
      };
    } else {
      layer = {
        id: fireSlice.layerName,
        type: "fill",
        source: fireSlice.sourceName,
        layout: {
          visibility: "none"
        },
        paint: {
          "fill-color": {
            property: "E_INTSTY",
            stops: state.fireIntensityLevels
          },
          "fill-opacity": state.fireOpacity
        }
      };
    }
    payload.map.addLayer(layer, payload.beforeLayer);
    state.loadedFireLayers.push(fireSlice.layerName);
  },
  setFireOpacity(state, value) {
    state.fireOpacity = value;
  },
  setFire3DFlameHeight(state, value) {
    state.fire3DFlameHeight = value;

    // set the pitch if we are enabling 3D
    if (value) state.mapInstance.easeTo({ pitch: 60 });
    else state.mapInstance.easeTo({ pitch: 0 });
  },
  clearFire(state, map) {
    // remove layers
    for (const layer of state.loadedFireLayers) map.removeLayer(layer);
    state.loadedFireLayers = [];
    // remove sources
    for (const source of state.loadedFireSources) map.removeSource(source);
    state.loadedFireSources = [];
  },
  setVisibleFireStep(state, newVal) {
    state.visibleFireStep = newVal;
  }
};

const actions = {
  resetAndMapboxStyle({ commit, rootGetters }, style) {
    // ensure any existing matsim/fire artifacts are removed
    commit("clearFire", rootGetters.mapInstance);
  },
  clearMap({ dispatch, commit, rootGetters }) {
    // ensure any existing matsim/fire artifacts are removed
    commit("clearFire", rootGetters.mapInstance);
  },
  loadLayers({ dispatch, getters }) {
    var selectedFire = getters.selectedFire;
    if (selectedFire) {
      dispatch("fetchFire", selectedFire.geojson);
    }
  },
  fetchFire({ dispatch, commit, getters, rootGetters }, url) {
    const map = rootGetters.mapInstance;
    commit("startLoading");

    // download and pre-process the geojson for better performance while rendering
    // we will build our own sources and layers for each fire step
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(geojson) {
        var features = geojson.features;
        // first sort
        features.sort(function(a, b) {
          if (a.properties.HOUR_BURNT === null) return -1;
          if (b.properties.HOUR_BURNT === null) return 1;
          else return a.properties.HOUR_BURNT - b.properties.HOUR_BURNT;
        });
        // now we can efficiently set up sources
        const lastFeature = features[features.length - 1];
        const totalMinutes = lastFeature.properties.HOUR_BURNT * 60;
        const totalSteps = Math.ceil(totalMinutes / getters.fireStepMinutes);

        // this will track the geojson features array
        var j = 0;
        // skip nulls
        while (features[j].properties.HOUR_BURNT === null) j++;
        // generate a geojson object for each step
        for (var i = 0; i < totalSteps; i++) {
          // set a threshold
          var threshold = (i * getters.fireStepMinutes) / 60;
          // create a fresh geojson structure for this layer
          var sect = {
            type: "FeatureCollection",
            features: []
          };

          // add all features below the minutes threshold to this structure
          while (features[j].properties.HOUR_BURNT < threshold) {
            sect.features.push(features[j]);
            j++;
          }

          // create this layer
          var stepStr = i.toString();
          var layer = "phoenix-layer" + stepStr;
          var source = "phoenix-source" + stepStr;
          commit("addFireSource", {
            map: map,
            fireSlice: {
              sourceName: source,
              geojson: sect
            }
          });
          commit("addFireLayer", {
            map: map,
            beforeLayer: getters.fireBeforeLayer,
            fireSlice: {
              sourceName: source,
              layerName: layer
            }
          });
        }
        dispatch("filterFire", totalSteps - 1); // load the final fire step
        commit("doneLoading");
      });
  },
  filterFire({ getters, commit }, fireStep) {
    var map = getters.mapInstance;

    // ensure every layer before the current step is on, and every one after is off
    for (var i = 0; i < getters.totalFireLayers; i++) {
      var layer = "phoenix-layer" + i.toString();
      if (i <= fireStep) map.setLayoutProperty(layer, "visibility", "visible");
      else map.setLayoutProperty(layer, "visibility", "none");
    }
    commit("setVisibleFireStep", fireStep);
  },
  resetFireLayers({ dispatch, getters, commit }) {
    var map = state.mapInstance;
    var totalFireLayers = getters.totalFireLayers;
    var i;
    var step;
    var layer;

    // we dont want to clear, just reset each fire layer
    for (i = 0; i < totalFireLayers; i++) {
      step = i.toString();
      layer = "phoenix-layer" + step;
      map.removeLayer(layer);
    }
    state.loadedFireLayers = [];

    for (i = 0; i < totalFireLayers; i++) {
      step = i.toString();
      var source = "phoenix-source" + step;
      layer = "phoenix-layer" + step;

      commit("addFireLayer", {
        sourceName: source,
        layerName: layer
      });
    }
    dispatch("filterFire", getters.visibleFireStep);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
