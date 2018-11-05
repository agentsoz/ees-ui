<template>
  <mapbox
    :access-token="mapboxAccessToken"
    :map-options="mapOpts"
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
    @map-load="storeMapInstance"
  >
  </mapbox>
</template>

<script>
import Mapbox from "mapbox-gl-vue";

import store from "../store";
import { mapGetters } from "vuex";

export default {
  name: "maplayer",
  computed: {
    ...mapGetters(["mapOpts", "mapboxAccessToken"])
  },
  components: {
    mapbox: Mapbox
  },
  methods: {
    storeMapInstance(map) {
      store.commit("setMapInstance", map);
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
