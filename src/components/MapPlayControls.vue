<template>
  <div class="time-slider-overlay">
    <div class="time-slider-overlay-inner">
      <b-row>
        <b-col class="pt-2 time-slider-controls">
          <button
            type="button"
            class="btn btn-outline-secondary"
            v-on:click="togglePlay"
          >
            <FontAwesomeIcon :icon="playPauseIcon" size="lg" />
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
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faPlay, faPause);

import { mapState } from "vuex";

export default {
  name: "mapPlayControls",
  components: { VueSlider, FontAwesomeIcon },
  props: {},
  data: () => {
    const fps = 6;
    return {
      playing: false,
      fps: fps,
      fpsInterval: 1000 / fps,
      lastFrame: 0
    };
  },
  computed: {
    playPauseIcon() {
      if (this.playing) return "pause";
      else return "play";
    },
    labelStep() {
      return {
        sm: ((60 * 60) / this.stepSeconds) * 6,
        md: ((60 * 60) / this.stepSeconds) * 4,
        lg: (60 * 60) / this.stepSeconds
      };
    },
    ...mapState({
      stepSeconds: state => state.output.stepSeconds,
      visibleStep: state => state.output.visibleStep,
      fireStepMinutes: state => state.fire.stepMinutes // rest of system is on minute steps
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
        var minutes = (val * this.stepSeconds) / 60;
        this.$store.dispatch(
          "filter",
          parseInt(minutes / this.fireStepMinutes)
        );
        this.$store.dispatch("filterSeconds", val);
      }
    },
    maxSteps() {
      return (24 * 60 * 60) / this.stepSeconds;
    }
  },
  methods: {
    togglePlay() {
      // if we are sitting at the last fram and play is pressed,
      // we may as well play from the beginning
      if (this.visibleStep == this.maxSteps) this.$store.dispatch("filter", 0);
      if (this.visibleStep == this.maxSteps)
        this.$store.dispatch("filterSeconds", 0);

      this.playing = !this.playing;
      this.stepFrames();
    },
    stepFrames() {
      if (!this.playing) return;

      if (this.visibleStep >= this.maxSteps) {
        this.playing = false;
        return;
      }

      const now = Date.now();
      const elapsed = now - this.lastFrame;
      if (elapsed > this.fpsInterval) {
        var minutes = ((this.visibleStep + 1) * this.stepSeconds) / 60;
        this.$store.dispatch(
          "filter",
          parseInt(minutes / this.fireStepMinutes)
        ); // the rest of the system does not use second steps
        this.$store.dispatch("filterSeconds", this.visibleStep + 1);
        this.lastFrame = now;
      }
      requestAnimationFrame(this.stepFrames);
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
        Math.floor((timeStep * this.stepSeconds) / (60 * 60)).toString() +
        ":" +
        (parseInt((timeStep * this.stepSeconds) / 60) % 60)
          .toString()
          .padStart(2, "0")
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
