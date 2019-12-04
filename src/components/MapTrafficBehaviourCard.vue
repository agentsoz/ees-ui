<template>
  <b-card class="mb-1" header="Traffic Behaviour Setup">
    <b-collapse visible id="collapse-traffic">
      <label>
        Maximum speed on roads (as % of speed limits)
        <span class="helper-icons">
          <FontAwesomeIcon icon="info-circle" v-b-popover.hover="helpText" />
        </span>
      </label>
      <div class="traffic-slider">
        <vue-slider
          ref="trafficslider"
          v-bind="sliderConfig"
          v-model="trafficSpeed"
          :interval="10"
          :tooltip="'always'"
          :tooltip-formatter="valueToPercent"
          :marks="valueToMark"
          :drag-on-click="true"
        >
        </vue-slider>
      </div>
    </b-collapse>
  </b-card>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

library.add(faInfoCircle);

export default {
  name: "mapTrafficCard",
  components: { VueSlider, FontAwesomeIcon },
  props: ["trafficSpeed", "helpText"],
  data: function() {
    return {
      sliderConfig: {
        min: 0,
        max: 100,
        dotStyle: {
          display: "none"
        }
      },
      valueToPercent: val => {
        return `${val}%`;
      },
      valueToMark: val => ({
        label: val % 100 === 0 ? this.valueToPercent(val) : ""
      })
    };
  }
};
</script>

<style>
.traffic-slider {
  padding: 1.5em 0.5em 0.5em 0.5em;
}
</style>
