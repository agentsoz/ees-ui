<template>
  <div v-on:keydown.esc.capture="toggleSettingsVis()">
    <maplayer/>
    <slider/>
    <spinner/>
    <population/>
    <accordion/>
    <settings/>
  </div>
</template>

<script>
import MapComponent from "@/components/Map.vue";
import MapTimeSlider from "@/components/MapTimeSlider.vue";
import MapSquarePopulation from "@/components/MapSquarePopulation.vue";
import MapLoadSpinner from "@/components/MapLoadSpinner.vue";
import MapAccordion from "@/components/MapAccordion.vue";
import MapSettings from "@/components/MapSettings.vue";

import { mapActions } from "vuex";

export default {
  name: "home",
  components: {
    maplayer: MapComponent,
    slider: MapTimeSlider,
    spinner: MapLoadSpinner,
    population: MapSquarePopulation,
    accordion: MapAccordion,
    settings: MapSettings
  },
  methods: {
    ...mapActions(["toggleSettingsVis"])
  }
};
</script>
