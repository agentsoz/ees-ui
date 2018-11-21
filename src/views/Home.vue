<template>
  <div v-on:keydown.esc.capture="toggleSettings()">
    <maplayer/>
    <slider/>
    <spinner/>
    <settings/>
  </div>
</template>

<script>
import MapComponent from "@/components/Map.vue";
import MapTimeSlider from "@/components/MapTimeSlider.vue";
import MapLoadSpinner from "@/components/MapLoadSpinner.vue";
import MapSettings from "@/components/MapSettings.vue";

export default {
  name: "home",
  components: {
    maplayer: MapComponent,
    slider: MapTimeSlider,
    spinner: MapLoadSpinner,
    settings: MapSettings
  },
  methods: {
    toggleSettings: MapSettings.methods.toggle
  }
};
</script>
