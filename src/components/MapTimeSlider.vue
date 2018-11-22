<template>
    <div class='time-slider-overlay'>
      <div class='time-slider-overlay-inner'>
        <vue-slider ref="fireslider" id="custom-tootip" v-bind="sliderConfig" @callback="updateFilter">
          <template slot="label" slot-scope="{ label, active }">
            <span :class="['custom-label', { active }]" v-if="renderLabelTick(label)">
              {{ stepToLabel(label) }}
            </span>
          </template>
        </vue-slider>
      </div>
    </div>
</template>

<script>
import vueSlider from "vue-slider-component";
import { mapState, mapGetters } from "vuex";

export default {
  name: "mapSlider",
  components: { vueSlider },
  props: {},
  data: function() {
    var ls = []; // label step size
    ls["sm"] = 12;
    ls["md"] = 9;
    ls["lg"] = 6;
    return {
      labelStep: ls
    };
  },
  computed: {
    ...mapState({
      visibleFireStep: state => state.map.visibleFireStep,
      fireSliderTicks: state => state.map.fireSliderTicks
    }),
    ...mapGetters(["totalFireLayers"]),
    sliderConfig() {
      return {
        width: "98%",
        show: true,
        value: this.visibleFireStep ? this.visibleFireStep : 0,
        min: 0,
        max: this.totalFireLayers ? this.totalFireLayers - 1 : 0,
        piecewiseLabel: true,
        tooltip: false
      };
    }
  },
  methods: {
    renderLabelTick(timeStep) {
      if (this.fireSliderTicks || this.hasLabel(timeStep)) return true;
    },
    hasLabel(timeStep) {
      var interval = this.$data.labelStep[this.$mq];
      var notTooClose = timeStep < this.totalFireLayers - interval + 1;
      return (
        (timeStep % interval === 0 && notTooClose) ||
        timeStep === this.totalFireLayers - 1
      );
    },
    stepToLabel(timeStep) {
      // if this tick is to have a label, send it, otherwise just a tick
      if (this.hasLabel(timeStep))
        return (
          "+" +
          Math.floor((timeStep * 10) / 60).toString() +
          ":" +
          ((timeStep * 10) % 60).toString().padStart(2, "0")
        );
      else return "";
    },
    updateFilter(val) {
      this.$store.dispatch("filterFire", val);
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
  overflow: auto;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  z-index: 100;
}

.time-slider-overlay .time-slider-overlay-inner {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 24px 15px 15px 14px;
  margin-bottom: 10px;
  overflow: hidden;
}
.time-slider-overlay-inner .vue-slider-component.vue-slider-has-label {
  margin: 0 auto;
}
.custom-label {
  position: absolute;
  bottom: 100%;
  left: 0;
  transform: translate(-50%, -4px);
  margin-left: 3px;
}
.custom-label::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 5px);
  width: 1px;
  height: 5px;
  background-color: #000;
}
.custom-label.active {
  color: #2980b9;
  font-weight: bold;
}
.custom-label.active::after {
  background-color: #2980b9;
  width: 2px;
}
.time-slider-overlay-inner .vue-slider-component .vue-slider-dot-handle {
  width: 0;
  height: 0;
  border: 20px solid transparent;
  background-color: transparent;
  box-shadow: none;
  border-bottom-color: #2488cb;
  position: relative;
  transform: translateY(-15px) translateX(-12px);
}
</style>
