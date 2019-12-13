<template>
  <div
    v-if="visibleFireStep || visibleFireStep === 0"
    class="time-slider-overlay"
  >
    <div class="time-slider-overlay-inner">
      <vue-slider
        ref="fireslider"
        v-bind="sliderConfig"
        v-model="timeStep"
        :marks="hasLabel"
        :tooltip="'always'"
        :tooltip-formatter="stepToTime"
        :use-keyboard="true"
      >
        <template v-slot:label="{ active, value }">
          <div :class="['vue-slider-mark-label', 'custom-label', { active }]">
            {{ stepToTime(value) }}
          </div>
        </template>
      </vue-slider>
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import { mapState, mapGetters } from "vuex";

export default {
  name: "mapSlider",
  components: { VueSlider },
  props: {},
  data: function() {
    var ls = []; // label step size
    ls["sm"] = 6 * 6;
    ls["md"] = 6 * 4;
    ls["lg"] = 6;
    return {
      labelStep: ls
    };
  },
  computed: {
    ...mapState({
      fireStepMinutes: state => state.fire.fireStepMinutes,
      visibleFireStep: state => state.fire.visibleFireStep,
      fireSliderTicks: state => state.fire.fireSliderTicks
    }),
    ...mapGetters(["totalFireLayers"]),
    sliderConfig() {
      return {
        width: "98%",
        value: this.visibleFireStep ? this.visibleFireStep : 0,
        min: 0,
        max: this.maxSteps
      };
    },
    timeStep: {
      get() {
        return this.visibleFireStep;
      },
      set(val) {
        this.$store.dispatch("filter", val);
      }
    },
    maxSteps() {
      return (24 * 60) / this.fireStepMinutes;
    }
  },
  methods: {
    hasLabel(timeStep) {
      var interval = this.labelStep[this.$mq];
      var notTooClose = timeStep < this.maxSteps - interval + 1;
      return (
        (timeStep % interval === 0 && notTooClose) ||
        timeStep === this.maxSteps - 1
      );
    },
    stepToTime(timeStep) {
      return (
        Math.floor((timeStep * 10) / 60).toString() +
        ":" +
        ((timeStep * 10) % 60).toString().padStart(2, "0")
      );
    }
  }
};
</script>

<style>
.time-slider-overlay {
  position: absolute;
  width: 88%;
  bottom: 2.5%;
  right: 0;
  height: auto;
  overflow: visible;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  z-index: 100;
}

.time-slider-overlay .time-slider-overlay-inner {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 0 1em 1.5em 2em;
  margin-bottom: 10px;
  overflow: visible;
}
.vue-slider-process {
  background-color: rgb(16, 102, 253);
}
.vue-slider-dot-tooltip-inner {
  background-color: rgb(16, 102, 253);
}
.vue-slider-dot-tooltip-inner:after {
  border-top-color: rgb(16, 102, 253);
}
</style>
