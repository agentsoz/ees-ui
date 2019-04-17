// Used to store state of smoke geojson and layers
// This model uses a lot of the same methods and functions as fire.js, it
// be good idea to refactor both of the models

import {
    DONE_LOADING,
    EMBER_ADD_SOURCE,
    SELECT_SMOKE,
    EMBER_ADD_LAYER,
    EMBER_SET_OPACITY,
    EMBER_TIME_STEP,
    CLEAR_SMOKE,
    TOGGLE_3D,
    SHOW_SMOKE
} from "@/store/mutation-types";

const state = {
    smokeStepMinutes: 10,
    selectedSmoke: null,
    loadedSmokeLayers: [],
    loadedSmokeSources: [],
    visibleSmokeStep: null,
    smoke3DHeight: false,
    smokeSliderTicks: true,
    smokeOpacity: 0.4,
    showSmoke: false,
    smokeIntensityLevels: [[0, "#ffc107"], [100000, "#dc3545"]]
};

const getters = {
    smokeStepMinutes: state => state.smokeStepMinutes,
    visibleSmokeStep: state => state.visibleSmokeStep,
    totalSmokeLayers: state => state.loadedSmokeLayers.length,
    selectedSmoke: state => state.selectSmoke,
    smokeAboveLayer: (state, getters, rootState) => {
        return rootState.firstSymbolLayer;
    }
};

const mutations = {
    [SELECT_SMOKE](state, newVal) {
        state.selectedSmoke = newVal;
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
        if (state.smoke3DHeight) {
            layer = {
                id: smokeSlice.layerName,
                type: "fill-extrusion",
                source: smokeSlice.sourceName,
                filter: ["has", "SMOKE_HT"],
                layout: {
                    visibility: "none"
                },
                paint: {
                    "fill-extrusion-color": {
                        property: "E_INTSTY",
                        stops: state.smokeIntensityLevels
                    },
                    "fill-extrusion-height": {
                        property: "SMOKE_HT",
                        stops: [[0, 1], [300, 1000]]
                    },
                    "fill-extrusion-base": 0,
                    "fill-extrusion-opacity": state.smokeOpacity
                }
            };
        } else {
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
        }
        payload.map.addLayer(layer, payload.beforeLayer);
        state.loadedSmokeLayers.push(smokeSlice.layerName);
    },
    [EMBER_SET_OPACITY](state, value) {
        state.smokeOpacity = value;
    },
    [SHOW_SMOKE](state, value) {
        state.showSmoke = value;
    },
    [TOGGLE_3D](state, value) {
        state.smoke3DHeight = value;
    },
    [CLEAR_SMOKE](state, map) {
        // remove layers
        for (const layer of state.loadedSmokeLayers) map.removeLayer(layer);
        state.loadedSmokeLayers = [];
        // remove sources
        for (const source of state.loadedSmokeSources) map.removeSource(source);
        state.loadedSmokeSources = [];
        state.visibleSmokeStep = null;
    },
    [EMBER_TIME_STEP](state, newVal) {
        state.visibleSmokeStep = newVal;
    }
};

const actions = {
    clearMap({ commit, rootGetters }) {
        commit(CLEAR_SMOKE, rootGetters.mapInstance);
    },
    selectSmoke({ dispatch, commit }, smoke) {
        commit(SELECT_SMOKE, smoke);

        if (this.state.smoke.showSmoke)
            dispatch("fetchSmoke", !this.state.smoke.selectedSmoke ? "" : this.state.smoke.selectedSmoke);
    },
    showSmoke({ dispatch, commit, rootGetters }, value) {
        commit(SHOW_SMOKE, value);

        if (this.state.smoke.showSmoke)
            dispatch("fetchSmoke", !this.state.smoke.selectedSmoke ? "" : this.state.smoke.selectedSmoke);
        else {
            const map = rootGetters.mapInstance;
            commit(CLEAR_SMOKE, map);
        }
    },
    fetchSmoke({ dispatch, commit, getters, rootGetters }, url) {
        const map = rootGetters.mapInstance;
        commit(CLEAR_SMOKE, map);

        // download and pre-process the geojson for better performance while rendering
        // we will build our own sources and layers for each smoke step

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (geojson) {
                var features = geojson.features;
                // first sort
                features.sort(function (a, b) {
                    if (a.properties.hour_spot === null) return -1;
                    if (b.properties.hour_spot === null) return 1;
                    else return a.properties.hour_spot - b.properties.hour_spot;
                });
                // now we can efficiently set up sources
                const lastFeature = features[features.length - 1];
                const totalMinutes = lastFeature.properties.hour_spot * 60;
                const totalSteps = Math.ceil(totalMinutes / getters.smokeStepMinutes);

                // this will track the geojson features array
                var j = 0;
                // skip nulls
                while (features[j].properties.hour_spot === null) j++;
                // generate a geojson object for each step
                for (var i = 0; i < totalSteps; i++) {
                    // set a threshold
                    var threshold = (i * getters.smokeStepMinutes) / 60;
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
                dispatch("filterSmoke", totalSteps - 1); // load the final smoke step
                commit(DONE_LOADING);
            });
    },
    filterSmoke({ getters, commit }, smokeStep) {
        var map = getters.mapInstance;

        // ensure every layer before the current step is on, and every one after is off
        for (var i = 0; i < getters.totalSmokeLayers; i++) {
            var layer = "ember-layer" + i.toString();
            if (i <= smokeStep) map.setLayoutProperty(layer, "visibility", "visible");
            else map.setLayoutProperty(layer, "visibility", "none");
        }
        commit(EMBER_TIME_STEP, smokeStep);
    },
    resetSmokeLayers({ dispatch, rootGetters, getters, commit }) {
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
        dispatch("filterSmoke", getters.visibleSmokeStep);
    },
    toggleSmokeIn3D({ dispatch, state, commit }) {
        commit(TOGGLE_3D, !state.smoke3DHeight);
        dispatch("resetSmokeLayers");
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
