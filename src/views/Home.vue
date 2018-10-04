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
    @map-load="onMapLoad"
  >
  </mapbox>
</template>

<script>
import Mapbox from "mapbox-gl-vue";

var opts = {
  style: "mapbox://styles/mapbox/dark-v9",
  center: [144.218571, -37.0646], // Castlemaine VIC
  minZoom: 0,
  zoom: 10,
  maxZoom: 14
};

function onMapLoad(map) {
  map.addSource("roadtiles", {
    type: "vector",
    tiles: ["https://ees-server.now.sh/tiles/roads/{z}/{x}/{y}.pbf"],
    minzoom: 0,
    maxzoom: 14
  });

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
      id: "matsim-network",
      type: "line",
      source: "roadtiles",
      "source-layer": "mount_alexander_shire_networkP",
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
  map.addLayer(
    {
      id: "fire-geojson",
      type: "line",
      source: {
        type: "geojson",
        data:
          "https://raw.githubusercontent.com/agentsoz/ees/master/scenarios/mount-alexander-shire/maldon-100-with-emergency-vehicles/scenario_fire.json"
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

export default {
  name: "home",
  components: {
    mapbox: Mapbox
  },
  methods: {
    onMapLoad: onMapLoad
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
  height:500px;
  width: 100%;
}
</style>
