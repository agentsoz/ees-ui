<template>
  <mapbox
    access-token="pk.eyJ1IjoiZGhpeHNpbmdoIiwiYSI6ImNqbWx4OTR0ZzBkMWUzb255and1aTUweGkifQ.U0vPiwyfM4ad7axC_4dkHg"
    :map-options="{
      style: '/styles/mapbox-dark-custom.json',
      center: [144.218571, -37.064600], // Castlemaine VIC
      minZoom: 0,
      zoom: 10,
      maxZoom: 14
    }"
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
export default {
  name: "home",
  components: {
    mapbox: Mapbox
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
