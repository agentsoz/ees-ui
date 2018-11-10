<template>
  <div v-on:keydown.esc.capture="toggleSettings()">
    <maplayer/>
    <slider/>
    <settings/>
  </div>
</template>

<script>
import MapComponent from "@/components/Map.vue";
import MapTimeSlider from "@/components/MapTimeSlider.vue";
import MapSettings from "@/components/MapSettings.vue";

export default {
  name: "home",
  components: {
    maplayer: MapComponent,
    slider: MapTimeSlider,
    settings: MapSettings
  },
  methods: {
    toggleSettings: MapSettings.methods.toggle
  }
};
</script>
