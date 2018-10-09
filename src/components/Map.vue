<template>
  <mapbox
    access-token="pk.eyJ1IjoiZGhpeHNpbmdoIiwiYSI6ImNqbWx4OTR0ZzBkMWUzb255and1aTUweGkifQ.U0vPiwyfM4ad7axC_4dkHg"
    v-bind:map-options="opts"
    :geolocate-control="{
      show: true,
      position: 'top-left'
    }"
    :scale-control="{
      show: true,
      position: 'bottom-left'
    }"
    :fullscreen-control="{
      show: true,
      position: 'top-left'
    }"
    @map-load="loadLayers"
  >
  </mapbox>
</template>

<script>
import store from "../store";
import Mapbox from "mapbox-gl-vue";

var opts = {
  style: "mapbox://styles/mapbox/" + store.getters.mapboxStyle + "-v9",
  center: store.getters.mapCenter,
  minZoom: 0,
  zoom: 10,
  maxZoom: 14
};

function addMATSimNetworkLayer(map, matsimLayer) {
  var layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style
  var firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol") {
      firstSymbolId = layers[i].id;
      break;
    }
  }

  map.addLayer(
    {
      id: matsimLayer,
      type: "line",
      source: matsimLayer,
      "source-layer": matsimLayer,
      minzoom: 0,
      maxzoom: 22,
      paint: {
        "line-color": "#7777ff",
        "line-width": 0.5
      }
    },
    // This is the important part of this example: the addLayer
    // method takes 2 arguments: the layer as an object, and a string
    // representing another layer's name. if the other layer
    // exists in the stylesheet already, the new layer will be positioned
    // right before that layer in the stack, making it possible to put
    // 'overlays' anywhere in the layer stack.
    // Insert the layer beneath the first symbol layer.
    firstSymbolId
  );
}

export function setFireLayer(map, name, url) {
  // Set the data only if layer exists
  var layer = map.getLayer(name);
  if (typeof layer != "undefined") {
    map.getSource(name).setData(url);
    return;
  }
  // Else create the layer
  var layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style
  var firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol") {
      firstSymbolId = layers[i].id;
      break;
    }
  }
  map.addLayer(
    {
      id: name,
      type: "line",
      source: {
        type: "geojson",
        data: url
      },
      layout: {},
      paint: {
        "line-color": "#f00",
        "line-opacity": 0.4,
        "line-width": 2.0
      }
    },
    firstSymbolId
  );
}

function addMATSimNetworkSource(map, name, pbfurl) {
  map.addSource(name, {
    type: "vector",
    tiles: [pbfurl],
    minzoom: 0,
    maxzoom: 14
  });
}

function loadLayers(map, tryRemove) {
  store.commit("setMapInstance", map);
  // Remove the source+layer first when changing base map style
  if (tryRemove == true) {
    try {
      map.removeLayer(store.getters.matsimNetworkLayer);
      map.removeSource(store.getters.matsimNetworkLayer);
    } catch (e) {
      // ignore!
    }
  }
  addMATSimNetworkSource(
    map,
    store.getters.matsimNetworkLayer,
    "https://ees-server.now.sh/tiles/roads/{z}/{x}/{y}.pbf"
  );
  addMATSimNetworkLayer(map, store.getters.matsimNetworkLayer);
  setFireLayer(map, "phoenix-layer", store.getters.selectedFireData.geojson);
  map.on("styledata", function(/*event*/) {
    if (store.getters.reloadOverlayLayersOnStyleData == true) {
      loadLayers(map, store.getters.reloadOverlayLayersOnStyleData);
      store.commit("setReloadOverlayLayersOnStyleData", false);
    }
  });
}

export default {
  name: "maplayer",
  components: {
    mapbox: Mapbox
  },
  methods: {
    loadLayers,
    setFireLayer
  },
  data: function() {
    return {
      opts: opts
    };
  }
};
</script>

<style scoped lang="css">
#map {
  position: relative;
  text-align: left;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
}
</style>
