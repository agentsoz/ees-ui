<template>
  <div class="map-settings-container">
    <div class='map-overlay' v-show="isOpen">
    <div class='map-population-panel'>
      <label for="map-population">Population inside square:</label>
      <input id="map-population" type="text" v-model="squarePopulation">
      <button class="icon" type="button" @click='toggle()'>Save</button>
    </div>
    </div>
    <div id="map-link-panel"></div>
</div>
</template>

<script>
export default {
  name: "mapSquarePopulation",
  props: {
    squarePopulation: {
      default: 0,
      type: Number
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.map.squarePopulationIsOpen;
      },
      set(value) {
        this.$store.commit("setSquarePopulationIsOpen", value);
      }
    }
  },
  methods: {
    toggle: function() {
      this.$store.commit(
        "setSquarePopulationIsOpen",
        !this.$store.state.map.squarePopulationIsOpen
      );
    }
  }
};
</script>


<style>
.map-settings-panel select {
  text-align: center;
}

.map-settings-button-container {
  padding-top: 150px;
}

.map-settings-panel {
}

.map-overlay {
  font: bold 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
  position: absolute;
  width: 40%;
  top: 10%;
  right: 30%;
  height: auto;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 0 0 20px 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 100;
}

.map-overlay label {
  display: block;
  margin: 10px 0 0 0;
}

.map-overlay input {
  display: inline-block;
  width: 100%;
  position: relative;
  margin: 0;
}
</style>
