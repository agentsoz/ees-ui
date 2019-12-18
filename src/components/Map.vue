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
  ></mapbox>
</template>

<script>
import Mapbox from "mapbox-gl-vue";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";

import store from "@/store";
import {
  SET_MAP_INSTANCE,
  SET_DRAW_INSTANCE,
  SET_FIRST_SYMBOL_LAYER,
  MATSIM_SELECT_LINK,
  MATSIM_DESELECT_LINK
} from "@/store/mutation-types";
import { mapState } from "vuex";

export default {
  name: "maplayer",
  data: function() {
    return {
      disruptionSelected: false
    };
  },
  computed: {
    ...mapState({
      mapboxAccessToken: state => state.config.mapboxAccessToken,
      mapboxStyle: state => state.map.mapboxStyle,
      mapCenter: state => state.map.mapCenter,
      mapInstance: state => state.map.mapInstance,
      baseMATSimLayer: state => state.map.baseMATSimLayer,
      highlightMATSimLayer: state => state.map.highlightMATSimLayer,
      disruptionMATSimLayer: state => state.map.disruptionMATSimLayer,
      selectedDisruptionMATSimLayer: state =>
        state.map.selectedDisruptionMATSimLayer
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
      map.on("style.load", this.loadLayersOnStyleChange);

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

      store.commit(SET_MAP_INSTANCE, map);
      store.commit(SET_DRAW_INSTANCE, draw);

      store.commit(SET_FIRST_SYMBOL_LAYER);

      // load any layers that want to be loaded right away
      this.loadLayersOnStyleChange();
    },
    loadLayersOnStyleChange() {
      store.commit(SET_FIRST_SYMBOL_LAYER);
      store.dispatch("loadGlobal");
    },
    squareCreated(e) {
      var feature = e.features[0];
      store.commit("addPopulationSquare", feature);
    },
    mapOnClick(e) {
      //List of Links
      var linkList =
        store.state.map.selectedMATSimLink == ""
          ? []
          : store.state.map.selectedMATSimLink;
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

        const filteredItems = linkList.filter(item => item !== id);
        if (linkList.length != filteredItems.length) {
          linkList = filteredItems;
        } else {
          linkList.push(id);
        }
        var selectedDisruptionLinks = [];
        var popupText = "<strong>Link</strong>: " + id;
        var linksIsDisrupted = false;

        linkList.forEach(link => {
          store.state.map.disruptions.forEach(disruption => {
            //Check if selected link is disrupted.
            if (disruption.affectedLinks.includes(id)) {
              linksIsDisrupted = true;
              store.commit(MATSIM_SELECT_LINK, [id]);
              linkList = store.state.map.selectedMATSimLink;
              this.disruptionSelected = true;
              if (linksIsDisrupted) {
                var speedUnit = disruption.absoluteSpeed ? " km/h" : "% Slower";
                popupText +=
                  "<br><strong>Description</strong>: " +
                  disruption.description +
                  "<br><strong>Time</strong>: " +
                  disruption.start +
                  "-" +
                  disruption.end +
                  "<br><strong>Speed</strong>: " +
                  disruption.speed +
                  speedUnit +
                  "<br><strong>Affected Links: </strong>:<br>";
                selectedDisruptionLinks = disruption.affectedLinks;
                disruption.affectedLinks.forEach(link => {
                  popupText += link + "<br>";
                });
              }
            }
          });

          if (this.disruptionSelected && linksIsDisrupted == false) {
            store.commit(MATSIM_SELECT_LINK, [id]);
            linkList = store.state.map.selectedMATSimLink;
            this.disruptionSelected = false;
          }
        });

        //console.log("features:%s\n", JSON.stringify(features));
        filter = features.reduce(
          function(memo, feature) {
            if (!linksIsDisrupted) {
              linkList.forEach(link => {
                memo.push(link);
              });
            } else {
              selectedDisruptionLinks.forEach(link => {
                memo.push(link);
              });
            }
            return memo;
          },
          ["in", "ID"]
        );

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(popupText)
          .addTo(this.mapInstance);

        // this is displayed as the current link id in the menu
        store.commit(MATSIM_SELECT_LINK, linkList);
      } else {
        filter = ["in", "ID", ""];
        store.commit(MATSIM_DESELECT_LINK, linkList);
      }

      var disruptedFilter = ["in", "ID", ""];
      var highlightFilter = ["in", "ID", ""];
      linksIsDisrupted
        ? (disruptedFilter = filter)
        : (highlightFilter = filter);

      this.mapInstance.setFilter(
        this.selectedDisruptionMATSimLayer,
        disruptedFilter
      );
      this.mapInstance.setFilter(this.highlightMATSimLayer, highlightFilter);
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
