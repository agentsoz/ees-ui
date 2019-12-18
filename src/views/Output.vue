<template>
  <div>
    <maplayer />
    <slider />
    <spinner />
  </div>
</template>

<script>
import MapComponent from "@/components/Map.vue";
import MapPlayControls from "@/components/MapPlayControls.vue";
import MapLoadSpinner from "@/components/MapLoadSpinner.vue";

export default {
  name: "home",
  components: {
    maplayer: MapComponent,
    slider: MapPlayControls,
    spinner: MapLoadSpinner
  },
  methods: {}
};
</script>
