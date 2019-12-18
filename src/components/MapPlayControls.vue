<template>
  <div class="time-slider-overlay">
    <div class="time-slider-overlay-inner">
      <b-row>
        <b-col class="pt-2 time-slider-controls">
          <button v-on:click="stepFrame">
            <FontAwesomeIcon icon="play" size="2x" />
          </button>
        </b-col>
        <b-col cols="11">
          <vue-slider
            ref="playcontrols"
            v-bind="sliderConfig"
            v-model="timeStep"
            :marks="hasLabel"
            :tooltip="'always'"
            :tooltip-formatter="stepToTime"
            :use-keyboard="true"
          >
            <template v-slot:label="{ active, value }">
              <div
                :class="['vue-slider-mark-label', 'custom-label', { active }]"
              >
                {{ stepToTime(value) }}
              </div>
            </template>
          </vue-slider>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faPlay);

import { mapState } from "vuex";

export default {
  name: "mapPlayControls",
  components: { VueSlider, FontAwesomeIcon },
  props: {},
  data: () => {
    const fps = 4;
    return {
      fps: fps,
      fpsInterval: 1000 / fps,
      lastFrame: 0
    };
  },
  computed: {
    labelStep() {
      return {
        sm: (60 / this.stepMinutes) * 6,
        md: (60 / this.stepMinutes) * 4,
        lg: 60 / this.stepMinutes
      };
    },
    ...mapState({
      stepMinutes: state => state.output.stepMinutes,
      visibleStep: state => state.output.visibleStep
    }),
    sliderConfig() {
      return {
        width: "98%",
        value: this.visibleStep ? this.visibleStep : 0,
        min: 0,
        max: this.maxSteps
      };
    },
    timeStep: {
      get() {
        return this.visibleStep;
      },
      set(val) {
        this.$store.dispatch("filter", val);
      }
    },
    maxSteps() {
      return (24 * 60) / this.stepMinutes;
    }
  },
  methods: {
    stepFrame() {
      const now = Date.now();
      const elapsed = now - this.lastFrame;
      if (elapsed > this.fpsInterval) {
        this.$store.dispatch("filter", this.visibleStep + 1);
        this.lastFrame = now;
      }
      requestAnimationFrame(this.stepFrame);
    },
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
        Math.floor((timeStep * this.stepMinutes) / 60).toString() +
        ":" +
        ((timeStep * this.stepMinutes) % 60).toString().padStart(2, "0")
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
