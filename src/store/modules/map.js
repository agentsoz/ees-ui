// Mapbox state
// Used to store state of map, including layers etc

const state = {
  isLoading: 0,
  mapboxStyle: "dark",
  firstSymbolLayer: null,
  mapSettingsIsOpen: false,
  baseMATSimLayer: null,
  highlightMATSimLayer: null,
  loadedMATSimLayers: [],
  loadedMATSimSource: null,
  selectedRegion: null,
  populationSquares: [],
  squarePopulationIsOpen: false,
  affectedLinkIsOpen: false,
  mapInstance: null, // MapboxGL object
  drawInstance: null, // MapboxDraw object
  mapCenter: [144.968447, -37.818232] // Federeation Square Melbourne
};

const getters = {
  mapInstance: state => state.mapInstance,
  drawInstance: state => state.drawInstance,
  selectedStyle: (state, getters, rootState) => {
    if (!state.mapboxStyle) return null;
    var styles = rootState.config.styles;
    var style = styles.find(obj => obj.id === state.mapboxStyle);
    return style;
  },
  selectedRegion: (state, getters, rootState, rootGetters) => {
    if (!state.selectedRegion) return null;
    return rootGetters.region(state.selectedRegion);
  },
  firesInSelectedRegion: (state, getters, rootState, rootGetters) => {
    if (!state.selectedRegion) return [];
    return rootGetters.firesInRegion(state.selectedRegion);
  }
};

const mutations = {
  startLoading(state) {
    state.isLoading++;
  },
  doneLoading(state) {
    if (state.isLoading > 0) state.isLoading--;
  },
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
  drawPopulationSquare(state) {
    const map = state.mapInstance;
    const draw = state.drawInstance;
    draw.changeMode("draw_rectangle");
    map.getCanvas().style.cursor = "crosshair";
  },
  addPopulationSquare(state, feature) {
    // reset cursor to default
    state.mapInstance.getCanvas().style.cursor = "";
    state.populationSquares.push(feature);
    state.squarePopulationIsOpen = true;
  },
  setSquarePopulationIsOpen(state, value) {
    state.squarePopulationIsOpen = value;
  },
  setAffectedLinkIsOpen(state, value) {
    state.affectedLinkIsOpen = value;
  }
};

const actions = {
  resetAndMapboxStyle({ commit }, style) {
    // ensure any existing matsim artifacts are removed
    commit("clearMATSimLayers");
    commit("setMapboxStyle", style);
  },
  clearMap({ dispatch, commit }) {
    // ensure any existing matsim/fire artifacts are removed
    commit("clearMATSimLayers");
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
  },
  loadMATSimNetwork({ commit }, matsimNetwork) {
    // wake the server and give an indication of loading (experimental)
    commit("startLoading");
    fetch(process.env.VUE_APP_EES_TILES_API + "/wake/please").then(function() {
      commit("doneLoading"); // dont care about the response
    });

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
