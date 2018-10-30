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
import mapboxgl from "mapbox-gl";

var opts = {
  style: "mapbox://styles/mapbox/" + store.getters.mapboxStyle + "-v9",
  center: store.getters.map.center,
  minZoom: 0,
  zoom: 6,
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
  map.addLayer(
    {
      id: matsimLayer + "-highlighted",
      type: "line",
      source: matsimLayer,
      "source-layer": matsimLayer,
      minzoom: 0,
      maxzoom: 22,
      paint: {
        "line-color": "#FF8C00",
        "line-width": 1.5
      },
      filter: ["in", "ID", ""]
    },
    firstSymbolId
  );
}

export function flyTo(map, target) {
  map.flyTo({
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
  var selectedRegion = store.getters.selectedRegion;

  if (selectedRegion) {
    var region = store.getters.region(selectedRegion);

    //var matsimNetworkLayer = "matsim_network_layer"; // generic name for easy removal - not working
    var matsimNetworkLayer = region.matsimNetworkLayer;

    // Remove the source+layer first when changing base map style
    if (tryRemove == true) {
      try {
        map.removeLayer(matsimNetworkLayer);
        map.removeLayer(matsimNetworkLayer + "-higlighted");
        map.removeSource(matsimNetworkLayer);
      } catch (e) {
        // ignore!
      }
    }
    addMATSimNetworkSource(map, matsimNetworkLayer, region.matsimNetworkTiles);
    addMATSimNetworkLayer(map, matsimNetworkLayer);
    map.on("click", function(e) {
      // set bbox as 5px reactangle area around clicked point
      var bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ];
      var features = map.queryRenderedFeatures(bbox, {
        layers: [matsimNetworkLayer]
      });
      if (features) {
        var coordinates = features[0].geometry.coordinates.slice()[0][0];
        var id = features[0].properties.ID;
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML("Link " + id)
          .addTo(map);
        //console.log("features:%s\n", JSON.stringify(features));
        var filter = features.reduce(
          function(memo, feature) {
            memo.push(feature.properties.ID);
            return memo;
          },
          ["in", "ID"]
        );
        map.setFilter(matsimNetworkLayer + "-highlighted", filter);
      }
    });
  }
  var selectedFire = store.getters.selectedFireData;
  if (selectedFire) {
    setFireLayer(map, "phoenix-layer", selectedFire.geojson);
  }
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
    setFireLayer,
    flyTo
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
