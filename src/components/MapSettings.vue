<template>
  <div class="map-settings-container">
    <div class='map-settings-button-container mapboxgl-ctrl-top-right'>
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button class="icon sprocket" type="button" @click='toggle()'></button>
      </div>
    </div>
    <div class='map-overlay' v-show="isOpen">
    <div class='map-settings-panel'>
      <label for="map-style">Map style:</label>
      <select id="map-style" v-model="mapboxStyle">
        <option :disabled="mapboxStyle=='basic'" value="basic">basic</option>
        <option :disabled="mapboxStyle=='bright'" value="bright">bright</option>
        <option :disabled="mapboxStyle=='dark'" value="dark">dark</option>
        <option :disabled="mapboxStyle=='light'" value="light">light</option>
        <option :disabled="mapboxStyle=='satellite'" value="satellite">satellite</option>
        <option :disabled="mapboxStyle=='streets'" value="streets">streets</option>
      </select>
    </div>
    </div>
</div>
</template>

<script>
export default {
  name: "mapSettings",
  props: {},
  data: function() {
    return {
      isOpen: this.$store.getters.mapSettingsIsOpen
    };
  },
  computed: {
    mapboxStyle: {
      get() {
        return this.$store.getters.mapboxStyle;
      },
      set(value) {
        this.$store.commit("setMapboxStyle", value);
      }
    }
  },
  methods: {
    toggle: function() {
      this.isOpen = !this.isOpen;
      this.$store.commit(
        "setMapSettingsIsOpen",
        !this.$store.getters.mapSettingsIsOpen
      );
    }
  }
};
</script>


<style>
.map-settings-button-container {
  padding-top: 150px;
}

.map-settings-panel {
}

.map-overlay {
  font: bold 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
  position: absolute;
  width: 60%;
  top: 10%;
  right: 20%;
  height: 80%;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 100;
}

.map-overlay .map-overlay-inner {
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
}

.map-overlay label {
  display: block;
  margin: 0 0 10px;
}

.map-overlay input {
  background-color: transparent;
  display: inline-block;
  width: 100%;
  position: relative;
  margin: 0;
  cursor: ew-resize;
}
</style>
