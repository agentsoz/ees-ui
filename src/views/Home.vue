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
  >
  </mapbox>
</template>

<script>
import Mapbox from "mapbox-gl-vue";

var baseUrl = process.env.NODE_ENV === "production" ? "/ees-ui/" : "../../"
var opts = {
  style: baseUrl + "/styles/mapbox-dark-custom.json",
  center: [144.218571, -37.0646], // Castlemaine VIC
  minZoom: 0,
  zoom: 10,
  maxZoom: 14
};

export default {
  name: "home",
  components: {
    mapbox: Mapbox
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
