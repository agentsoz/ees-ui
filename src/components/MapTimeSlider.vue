<template>
    <div class='map-overlay top'>
      <div class='map-overlay-inner'>
        <h2>Fire Progression</h2>
        <label id='fire-step'></label>
        <input :value="visibleFireStep" @input="updateFilter" type='range' min='0' v-bind:max="totalFireLayers - 1" step='1' />
      </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "mapSlider",
  props: {},
  data: function() {
    return {
      styles: this.$store.getters.styles,
      regions: this.$store.getters.regions
    };
  },
  computed: {
    ...mapGetters(["visibleFireStep", "totalFireLayers"])
  },
  methods: {
    updateFilter(e) {
      this.$store.dispatch("filterFire", e.target.value);
    }
  }
};
</script>


<style>
.map-overlay {
  font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
  position: absolute;
  width: 25%;
  top: 0;
  right: 0;
  padding: 10px;
}

.map-overlay .map-overlay-inner {
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
}

.map-overlay h2 {
  line-height: 24px;
  display: block;
  margin: 0 0 10px;
}
</style>
