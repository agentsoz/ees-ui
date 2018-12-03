<template>
  <div class="map-settings-container" v-on:keydown.esc.capture="toggle()">
    <div class='map-settings-button-container mapboxgl-ctrl-top-right'>
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button class="icon sprocket" type="button" v-on:keydown.esc="toggle()" @click='toggle()'></button>
      </div>
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button class="icon grid" type="button" @click='drawRectangle()'></button>
      </div>
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button :class="{ 'font-weight-bold': renderFireIn3D }" type="button" @click='toggleFireIn3D()'>3D</button>
      </div>
    </div>
    <div class='map-overlay' v-show="isOpen">
    <div class='map-settings-panel' v-on:keydown.esc.capture="toggle()">
      <label for="map-style">Map style:</label>
      <select id="map-style" v-model="mapboxStyle">
        <option v-for="style in styles" :key="style.id" :value="style.id" :disabled="mapboxStyle==style.id">{{ style.name }}</option>
      </select>
      <label for="map-region">Region:</label>
      <select id="map-region" v-model="selectedRegion">
        <option value="no-region" disabled></option>
        <option v-for="region in regions" :key="region.id" :value="region.id" :disabled="selectedRegion==region.id">{{ region.name }}</option>
      </select>
      <label for="map-fire">Phoenix Fire:</label>
      <select id="map-fire" v-model="selectedFire">
        <option value="no-fire" disabled></option>
        <option v-for="fire in firesInSelectedRegion" :key="fire.id" :value="fire.id" :disabled="selectedFire==fire.id">{{ fire.name }}</option>
      </select>
      <label for="map-fire-opacity">Fire Opacity:</label>
      <input id="map-fire-opacity" type="number" min="0" max="1" step="0.01" v-model="fireOpacity" />
    </div>
    </div>
</div>
</template>

<script>
import { mapActions } from "vuex";
import { PHOENIX_SET_OPACITY } from "@/store/mutation-types";

export default {
  name: "mapSettings",
  props: {},
  data: function() {
    return {
      styles: this.$store.state.config.styles,
      regions: this.$store.state.config.regions
    };
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.map.mapSettingsIsOpen;
      },
      set(value) {
        this.$store.commit("mapSettingsIsOpen", value);
      }
    },
    firesInSelectedRegion() {
      return this.$store.getters.firesInSelectedRegion;
    },
    mapboxStyle: {
      get() {
        return this.$store.state.map.mapboxStyle;
      },
      set(value) {
        this.toggle();
        this.changeMapboxStyle(value);
      }
    },
    selectedRegion: {
      get() {
        return !this.$store.state.map.selectedRegion
          ? "no-region"
          : this.$store.state.map.selectedRegion;
      },
      set(value) {
        // close this settings window
        this.toggle();
        // set the selected region in state
        this.selectRegion(value);
      }
    },
    selectedFire: {
      get() {
        return this.$store.state.fire.selectedFire;
      },
      set(value) {
        this.toggle();
        this.selectFire(value);
      }
    },
    fireOpacity: {
      get() {
        return this.$store.state.fire.fireOpacity;
      },
      set(value) {
        var decimal = /^[-+]?[0-9]+\.[0-9]+$/;
        if (!value.match(decimal)) return;

        this.$store.commit(PHOENIX_SET_OPACITY, parseFloat(value));
        this.$store.dispatch("resetFireLayers");
      }
    },
    renderFireIn3D: {
      get() {
        return this.$store.state.fire.fire3DFlameHeight;
      }
    }
  },
  methods: {
    ...mapActions({
      toggleFireIn3D: "toggleFireIn3D",
      toggle: "toggleSettingsVis",
      changeMapboxStyle: "changeMapboxStyle",
      selectRegion: "selectRegion",
      selectFire: "selectFire"
    }),
    drawRectangle() {
      this.$store.commit("drawPopulationSquare");
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
