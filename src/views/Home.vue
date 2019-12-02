<template>
  <div v-on:keydown.esc.capture="toggleSettingsVis()">
    <maplayer />
    <slider />
    <spinner />
    <population />
    <setup />
    <settings />
    <savesettings />
  </div>
</template>

<script>
import MapComponent from "@/components/Map.vue";
import MapTimeSlider from "@/components/MapTimeSlider.vue";
import MapSquarePopulation from "@/components/MapSquarePopulation.vue";
import MapLoadSpinner from "@/components/MapLoadSpinner.vue";
import MapSetup from "@/components/MapSetup.vue";
import MapSettings from "@/components/MapSettings.vue";
import SaveSettings from "@/components/SaveSettings.vue";

import { mapActions } from "vuex";

export default {
  name: "home",
  components: {
    maplayer: MapComponent,
    slider: MapTimeSlider,
    spinner: MapLoadSpinner,
    population: MapSquarePopulation,
    setup: MapSetup,
    settings: MapSettings,
    savesettings: SaveSettings
  },
  methods: {
    ...mapActions(["toggleSettingsVis"])
  }
};
</script>
