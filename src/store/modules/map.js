// Mapbox state
// Used to store state of map, including layers etc

const state = {
  mapboxStyle: "dark",
  firstSymbolLayer: null,
  mapSettingsIsOpen: false,
  baseMATSimLayer: null,
  highlightMATSimLayer: null,
  loadedMATSimLayers: [],
  loadedMATSimSource: null,
  selectedRegion: null,
  fireStepMinutes: 10,
  selectedFire: null,
  loadedFireLayers: [],
  loadedFireSources: [],
  visibleFireStep: null,
  fireOpacity: 0.4,
  fireIntensityLevels: [[0, "#ffc107"], [100000, "#dc3545"]],
  mapInstance: null, // MapboxGL object
  drawInstance: null, // MapboxDraw object
  mapCenter: [144.968447, -37.818232] // Federeation Square Melbourne
};

const getters = {
  mapInstance: state => state.mapInstance,
  drawInstance: state => state.drawInstance,
  selectedRegion: (state, getters, rootState, rootGetters) => {
    if (!state.selectedRegion) return null;
    return rootGetters.region(state.selectedRegion);
  },
  fireStepMinutes: state => state.fireStepMinutes,
  totalFireLayers: state => state.loadedFireLayers.length,
  firesInSelectedRegion: (state, getters, rootState, rootGetters) => {
    if (!state.selectedRegion) return null;
    return rootGetters.firesInRegion(state.selectedRegion);
  },
  selectedFire: (state, getters) => {
    var fires = getters.firesInSelectedRegion;
    if (!fires) return null;

    var fire = fires.find(obj => obj.id === state.selectedFire);
    return fire;
  }
};

const mutations = {
  setMapInstance(state, newMap) {
    state.mapInstance = newMap;
  },
  setDrawInstance(state, newDraw) {
    state.drawInstance = newDraw;
  },
  setMapboxStyle(state, newStyle) {
    state.mapboxStyle = newStyle;
    state.mapInstance.setStyle(
      "mapbox://styles/mapbox/" + state.mapboxStyle + "-v9"
    );
  },
  setMapSettingsIsOpen(state, newVal) {
    state.mapSettingsIsOpen = newVal;
  },
  setSelectedRegion(state, newVal) {
    state.selectedRegion = newVal;
  },
  setBaseMATSimLayer(state, newVal) {
    state.baseMATSimLayer = newVal;
  },
  setHighlightMATSimLayer(state, newVal) {
    state.highlightMATSimLayer = newVal;
  },
  flyTo(state, target) {
    state.mapInstance.flyTo({
      // These options control the ending camera position: centered at
      // the target, at given zoom level, and north up.
      center: target,
      zoom: 8,
      bearing: 0,
      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      speed: 0.5, // make the flying slow
      curve: 1, // change the speed at which it zooms out

      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: function(t) {
        return t;
      }
    });
    state.mapCenter = target;
  },
  setFirstSymbolLayer(state) {
    var layers = state.mapInstance.getStyle().layers;
    // Find the index of the first symbol layer in the map style
    var firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === "symbol" && layers[i].id.includes("label")) {
        firstSymbolId = layers[i].id;
        break;
      }
    }
    state.firstSymbolLayer = firstSymbolId;
  },
  addMATSimLayer(state, matsimNetwork) {
    state.mapInstance.addLayer(
      {
        id: matsimNetwork.layerName,
        type: "line",
        source: matsimNetwork.sourceName,
        "source-layer": matsimNetwork.sourceLayer,
        minzoom: 0,
        maxzoom: 22,
        paint: matsimNetwork.paint,
        filter: matsimNetwork.filter
      },
      // This is the important part of this example: the addLayer
      // method takes 2 arguments: the layer as an object, and a string
      // representing another layer's name. if the other layer
      // exists in the stylesheet already, the new layer will be positioned
      // right before that layer in the stack, making it possible to put
      // 'overlays' anywhere in the layer stack.
      // Insert the layer beneath the first symbol layer.
      state.firstSymbolLayer
    );
    state.loadedMATSimLayers.push(matsimNetwork.layerName);
  },
  loadMATSimSource(state, matsimNetwork) {
    state.mapInstance.addSource(matsimNetwork.sourceName, {
      type: "vector",
      tiles: [matsimNetwork.pbfurl],
      minzoom: 0,
      maxzoom: 14
    });
    state.loadedMATSimSource = matsimNetwork.sourceName;
  },
  clearMATSimLayers(state) {
    var map = state.mapInstance;
    for (const layer of state.loadedMATSimLayers) map.removeLayer(layer);
    state.loadedMATSimLayers = [];

    if (state.loadedMATSimSource) {
      map.removeSource(state.loadedMATSimSource);
      state.loadedMATSimSource = null;
    }
    state.baseMATSimLayer = null;
    state.highlightMATSimLayer = null;
  },
  setSelectedFire(state, newVal) {
    state.selectedFire = newVal;
  },
  addFireLayer(state, layer) {
    var map = state.mapInstance;
    var step = layer.step.toString();
    var layerName = "phoenix-layer" + step;
    var sourceName = "phoenix-source" + step;

    // setup unique source and layer
    map.addSource(sourceName, {
      type: "geojson",
      data: layer.geojson
    });
    state.loadedFireSources.push(sourceName);

    map.addLayer(
      {
        id: layerName,
        type: "fill-extrusion",
        source: sourceName,
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
      },
      state.firstSymbolLayer
    );
    state.loadedFireLayers.push(layerName);
  },
  clearFire(state) {
    var map = state.mapInstance;
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
  resetAndMapboxStyle({ commit }, style) {
    // ensure any existing matsim/fire artifacts are removed
    commit("clearFire");
    commit("clearMATSimLayers");
    commit("setMapboxStyle", style);
  },
  loadMATSimRegion({ dispatch, commit }) {
    // ensure any existing matsim/fire artifacts are removed
    commit("clearFire");
    commit("clearMATSimLayers");
    // Load new region layers
    dispatch("loadLayers");
  },
  loadLayers({ dispatch, getters }) {
    var region = getters.selectedRegion;
    if (!region) return; // no region to be loaded

    var matsimNetwork = {
      sourceName: "matsim",
      pbfurl: region.matsimNetworkTiles,
      layerName: region.matsimNetworkLayer,
      sourceLayer: region.matsimNetworkLayer,
      paint: {
        "line-color": "#7777ff",
        "line-width": 0.5
      },
      filter: ["all"]
    };

    dispatch("loadMATSimNetwork", matsimNetwork);

    var selectedFire = getters.selectedFire;
    if (selectedFire) {
      dispatch("fetchFire", selectedFire.geojson);
    }
  },
  fetchFire({ dispatch, commit, getters }, url) {
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
          commit("addFireLayer", {
            step: i,
            geojson: sect
          });
        }
        dispatch("filterFire", totalSteps - 1); // load the final fire step
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
  loadMATSimNetwork({ commit }, matsimNetwork) {
    // load the matsim source
    commit("loadMATSimSource", matsimNetwork);

    // create the base matsim layer
    commit("addMATSimLayer", matsimNetwork);
    commit("setBaseMATSimLayer", matsimNetwork.layerName);

    // create the highlight layer above this (deep copy)
    var matsimNetworkHighlighted = JSON.parse(JSON.stringify(matsimNetwork));
    matsimNetworkHighlighted = Object.assign(matsimNetworkHighlighted, {
      layerName: matsimNetwork.layerName + "-highlighted",
      paint: {
        "line-color": "#FF8C00",
        "line-width": 1.5
      },
      filter: ["in", "ID", ""]
    });
    commit("addMATSimLayer", matsimNetworkHighlighted);
    commit("setHighlightMATSimLayer", matsimNetworkHighlighted.layerName);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
