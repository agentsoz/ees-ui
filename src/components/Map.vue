<template>
  <mapbox
    :access-token="mapboxAccessToken"
    :map-options="mapOpts"
    :geolocate-control="{
      show: true,
      position: 'top-right'
    }"
    :scale-control="{
      show: true,
      position: 'bottom-left'
    }"
    @map-load="storeMapInstance"
  >
  </mapbox>
</template>

<script>
import Mapbox from "mapbox-gl-vue";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
import MapAffectedLink from "@/components/MapAffectedLink.vue";

import store from "../store";
import Vue from "vue";
import { mapState } from "vuex";

var ModalComponentClass = Vue.extend(MapAffectedLink);

export default {
  name: "maplayer",
  computed: {
    ...mapState({
      mapboxAccessToken: state => state.config.mapboxAccessToken,
      mapboxStyle: state => state.map.mapboxStyle,
      mapCenter: state => state.map.mapCenter,
      mapInstance: state => state.map.mapInstance,
      baseMATSimLayer: state => state.map.baseMATSimLayer,
      highlightMATSimLayer: state => state.map.highlightMATSimLayer
    }),
    mapOpts() {
      var opts = {
        style: "mapbox://styles/mapbox/" + this.mapboxStyle + "-v9",
        center: this.mapCenter,
        minZoom: 0,
        zoom: 6,
        maxZoom: 18
      };
      return opts;
    }
  },
  components: {
    mapbox: Mapbox
  },
  methods: {
    storeMapInstance(map) {
      map.on("click", this.mapOnClick);
      map.on("draw.create", this.squareCreated);
      map.on("style.load", this.resetLayersOnStyleChange);

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        modes: Object.assign(
          { draw_rectangle: DrawRectangle },
          MapboxDraw.modes
        )
      });
      // mobile support: we cant add the control until we actually want to draw
      // https://github.com/agentsoz/ees-ui/issues/9
      // https://github.com/mapbox/mapbox-gl-draw/issues/617
      // Hacky Fix: https://github.com/cityofaustin/dockless/issues/48
      map.addControl(draw);

      store.commit("setMapInstance", map);
      store.commit("setDrawInstance", draw);

      store.commit("setFirstSymbolLayer");
    },
    resetLayersOnStyleChange() {
      store.commit("setFirstSymbolLayer");
      store.dispatch("loadMATSimRegion");
    },
    squareCreated(e) {
      var feature = e.features[0];
      store.commit("addPopulationSquare", feature);
    },
    mapOnClick(e) {
      // set bbox as 5px reactangle area around clicked point
      var bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ];
      var features = this.mapInstance.queryRenderedFeatures(bbox, {
        layers: [this.baseMATSimLayer]
      });
      var filter;
      if (typeof features != "undefined" && features.length !== 0) {
        var coordinates = features[0].geometry.coordinates.slice()[0][0];
        var id = features[0].properties.ID;
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML("Link " + id)
          .addTo(this.mapInstance);
        //console.log("features:%s\n", JSON.stringify(features));
        filter = features.reduce(
          function(memo, feature) {
            memo.push(feature.properties.ID);
            return memo;
          },
          ["in", "ID"]
        );
      } else {
        filter = ["in", "ID", ""];
      }
      this.mapInstance.setFilter(this.highlightMATSimLayer, filter);

      // generate modal
      var instance = new ModalComponentClass({
        store,
        propsData: { linkId: id }
      });
      instance.$mount("#map-link-panel");
      store.commit("setAffectedLinkIsOpen", true);
    }
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
