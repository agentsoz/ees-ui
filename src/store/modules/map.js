// Mapbox state
// Used to store state of map, including layers etc
import {
  START_LOADING,
  DONE_LOADING,
  SET_MAP_INSTANCE,
  SET_DRAW_INSTANCE,
  SET_MAPBOX_STYLE,
  SETTINGS_VISIBILITY,
  SELECT_REGION,
  CLEAR_REGION,
  FLY_TO,
  MATSIM_ADD_PLACEHOLDER_LAYERS,
  MATSIM_ADD_SOURCE,
  MATSIM_ADD_LAYER,
  MATSIM_SET_BASE_LAYER,
  MATSIM_SET_HIGHLIGHT_LAYER,
  MATSIM_SET_DISRUPTION_LAYER,
  MATSIM_SET_SELECTED_DISRUPTION_LAYER,
  MATSIM_SELECT_LINK,
  MATSIM_DESELECT_LINK,
  MATSIM_ADD_DISRUPTION,
  TOGGLE_3D
} from "@/store/mutation-types";

const state = {
  isLoading: 0,
  mapboxStyle: "dark",
  firstSymbolLayer: null,
  featureSetPlacementOrder: [
    // this defines the visibility order of each thing we place on the map
    "region",
    "fire",
    "smoke",
    "population",
    "output"
  ],
  featureSetPlaceholderLayerId: {}, // each element we draw will be placed before a layer stored here
  mapSettingsIsOpen: true,
  baseMATSimLayer: null,
  highlightMATSimLayer: null,
  loadedMATSimLayers: [],
  loadedMATSimSource: null,
  selectedRegion: null,
  populationSquares: [],
  squarePopulationIsOpen: false,
  selectedMATSimLink: "",
  disruptions: [],
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
  featureSetPlaceholderLayerId: state => state.featureSetPlaceholderLayerId,
  selectedRegion: (state, getters, rootState, rootGetters) => {
    if (!state.selectedRegion) return null;

    const region = rootGetters.region(state.selectedRegion);
    // further checks to make sure we actually have a region selected
    if (typeof region === "undefined") return null;
    else return region;
  },
  popInSelectedRegion: (state, getters, rootState, rootGetters) => {
    if (getters.selectedRegion === null) return getters.populations;
    return rootGetters.populationsWithTag(getters.selectedRegion.name);
  },
  firesInSelectedRegion: (state, getters, rootState, rootGetters) => {
    if (getters.selectedRegion === null) return getters.fires;
    return rootGetters.firesWithTag(getters.selectedRegion.name);
  }
};

const mutations = {
  [START_LOADING](state) {
    state.isLoading++;
  },
  [DONE_LOADING](state) {
    if (state.isLoading > 0) state.isLoading--;
  },
  [SET_MAP_INSTANCE](state, newMap) {
    state.mapInstance = newMap;
  },
  [SET_DRAW_INSTANCE](state, newDraw) {
    state.drawInstance = newDraw;
  },
  [SET_MAPBOX_STYLE](state, newStyle) {
    state.mapboxStyle = newStyle;
    state.mapInstance.setStyle(
      "mapbox://styles/mapbox/" + state.mapboxStyle + "-v9"
    );
  },
  [SETTINGS_VISIBILITY](state, newVal) {
    state.mapSettingsIsOpen = newVal;
  },
  [SELECT_REGION](state, newVal) {
    state.selectedRegion = newVal;
  },
  [MATSIM_SET_BASE_LAYER](state, newVal) {
    state.baseMATSimLayer = newVal;
  },
  [MATSIM_SET_HIGHLIGHT_LAYER](state, newVal) {
    state.highlightMATSimLayer = newVal;
  },
  [MATSIM_SET_DISRUPTION_LAYER](state, newVal) {
    state.disruptionMATSimLayer = newVal;
  },
  [MATSIM_SET_SELECTED_DISRUPTION_LAYER](state, newVal) {
    state.selectedDisruptionMATSimLayer = newVal;
  },
  [MATSIM_ADD_DISRUPTION](state, newVal) {
    state.disruptions.push(newVal);
  },
  [FLY_TO](state, target) {
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
  [TOGGLE_3D](state, value) {
    // set the pitch if we are enabling 3D
    if (value) state.mapInstance.easeTo({ pitch: 60 });
    else state.mapInstance.easeTo({ pitch: 0 });
  },
  [MATSIM_ADD_PLACEHOLDER_LAYERS](state) {
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

    // empty placeholder layers for each feature set
    var sect = {
      type: "FeatureCollection",
      features: []
    };
    state.mapInstance.addSource("placeholder", {
      type: "geojson",
      data: sect
    });
    for (const s of state.featureSetPlacementOrder) {
      const id = s + "-placeholder";
      state.mapInstance.addLayer(
        {
          id: id,
          type: "line",
          source: "placeholder",
          layout: { visibility: "none" }
        },
        state.firstSymbolLayer
      );
      state.featureSetPlaceholderLayerId[s] = id;
    }
  },
  [MATSIM_ADD_LAYER](state, matsimNetwork) {
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
      state.featureSetPlaceholderLayerId["region"]
    );
    state.loadedMATSimLayers.push(matsimNetwork.layerName);
  },
  [MATSIM_ADD_SOURCE](state, matsimNetwork) {
    state.mapInstance.addSource(matsimNetwork.sourceName, {
      type: "vector",
      tiles: [matsimNetwork.pbfurl],
      minzoom: 0,
      maxzoom: 14
    });
    state.loadedMATSimSource = matsimNetwork.sourceName;
  },
  [CLEAR_REGION](state) {
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
  [MATSIM_SELECT_LINK](state, value) {
    state.selectedMATSimLink = value;
  },
  [MATSIM_DESELECT_LINK](state) {
    state.selectedMATSimLink = [];
  },
  setAffectedLinkIsOpen(state, value) {
    state.affectedLinkIsOpen = value;
  }
};

const actions = {
  toggleSettingsVis({ state, commit }) {
    commit(SETTINGS_VISIBILITY, !state.mapSettingsIsOpen);
  },
  changeMapboxStyle({ commit, dispatch }, style) {
    // ensure any existing matsim artifacts are removed
    // by dispatch to all store modules
    dispatch("clearMap");
    commit(SET_MAPBOX_STYLE, style);
  },
  clearMap({ commit }) {
    // ensure any existing matsim/fire artifacts are removed
    commit(CLEAR_REGION);
  },
  selectRegion({ dispatch, commit, getters, state }, value) {
    if (state.selectedRegion == value) return; // noisy call because the computed property detected a 'change'

    if (getters.selectedRegion !== null) dispatch("clearMap");

    commit(SELECT_REGION, value);
    // load the relevant MATSim layers
    if (getters.selectedRegion != null) {
      dispatch("loadLayers");
      commit(FLY_TO, getters.selectedRegion.center);
    }
  },
  // this is called when a population or incident is selected
  // and region is not yet selected. we try to find one using the tags
  selectRelevantRegion({ dispatch, commit, getters }, tags) {
    // no region selected, see if we can find one in the tags
    fireloop: for (const tag of tags)
      for (const id in getters.regions)
        if (tag == getters.regions[id].name) {
          // we have found a tag that corresponds to a region
          dispatch("selectRegion", id);
          //dispatch("loadLayers");
          //commit(FLY_TO, getters.selectedRegion.center);
          break fireloop;
        }
  },
  // Used in Map.vue by loadLayersOnStyleChange.
  // Adds both source and layers back to the map in the event of a style change
  // Must be implemented by any module that
  // adds sources/layers to mapbox.
  loadGlobal: {
    root: true,
    handler({ getters, dispatch }) {
      const map = getters.mapInstance;
      dispatch("loadLayers");
    }
  },
  loadLayers({ dispatch, getters }) {
    var region = getters.selectedRegion;
    if (!region) return; // no region to be loaded

    var matsimNetwork = {
      sourceName: "matsim",
      pbfurl: process.env.VUE_APP_EES_TILES_API + region.matsimNetworkTiles,
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
    commit(START_LOADING);
    fetch(process.env.VUE_APP_EES_TILES_API + "/wake/please").then(function() {
      commit(DONE_LOADING); // dont care about the response
    });

    // load the matsim source
    commit(MATSIM_ADD_SOURCE, matsimNetwork);

    // create the base matsim layer
    commit(MATSIM_ADD_LAYER, matsimNetwork);
    commit(MATSIM_SET_BASE_LAYER, matsimNetwork.layerName);

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
    commit(MATSIM_ADD_LAYER, matsimNetworkHighlighted);
    commit(MATSIM_SET_HIGHLIGHT_LAYER, matsimNetworkHighlighted.layerName);

    //Disruptions layer
    var matsimNetworkHighlightedDisruptions = JSON.parse(
      JSON.stringify(matsimNetwork)
    );
    matsimNetworkHighlightedDisruptions = Object.assign(
      matsimNetworkHighlightedDisruptions,
      {
        layerName: matsimNetwork.layerName + "-highlightedDisruptions",
        paint: {
          "line-color": "#FF0000",
          "line-width": 1.5
        },
        filter: ["in", "ID", ""]
      }
    );
    commit(MATSIM_ADD_LAYER, matsimNetworkHighlightedDisruptions);
    commit(
      MATSIM_SET_DISRUPTION_LAYER,
      matsimNetworkHighlightedDisruptions.layerName
    );

    //Selected disruption layer
    var matsimNetworkSelectedDisruptions = JSON.parse(
      JSON.stringify(matsimNetwork)
    );
    matsimNetworkSelectedDisruptions = Object.assign(
      matsimNetworkSelectedDisruptions,
      {
        layerName: matsimNetwork.layerName + "-selectedDisruptions",
        paint: {
          "line-color": "#00bfff",
          "line-width": 1.5
        },
        filter: ["in", "ID", ""]
      }
    );
    commit(MATSIM_ADD_LAYER, matsimNetworkSelectedDisruptions);
    commit(
      MATSIM_SET_SELECTED_DISRUPTION_LAYER,
      matsimNetworkSelectedDisruptions.layerName
    );
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
