<template>
  <div v-on:keydown.esc.capture="toggleSettings()">
    <maplayer/>
    <settings/>
  </div>
</template>

<script>
import MapComponent from "@/components/Map.vue";
import MapSettings from "@/components/MapSettings.vue";

export default {
  name: "home",
  components: {
    maplayer: MapComponent,
    settings: MapSettings
  },
  methods: {
    toggleSettings: MapSettings.methods.toggle
  }};
</script>
