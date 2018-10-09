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
        <option v-for="style in styles" :key="style.id" :value="style.id" :disabled="mapboxStyle==style.id">{{ style.name }}</option>
      </select>
      <label for="map-region">Region:</label>
      <select id="map-region" v-model="selectedRegion">
        <option v-for="region in regions" :key="region.id" :value="region.id" :disabled="selectedRegion==region.id">{{ region.name }}</option>
      </select>
      <label for="map-fire">Phoenix Fire:</label>
      <select id="map-fire" v-model="selectedFire">
        <option v-for="fire in firesInSelectedRegion" :key="fire.id" :value="fire.id" :disabled="selectedFire==fire.id">{{ fire.name }}</option>
      </select>
    </div>
    </div>
</div>
</template>

<script>
import Map from "@/components/Map";
export default {
  name: "mapSettings",
  props: {},
  data: function() {
    return {
      isOpen: this.$store.getters.mapSettingsIsOpen,
      styles: this.$store.getters.map.styles,
      regions: this.$store.getters.regions,
      firesInSelectedRegion: this.$store.getters.firesInSelectedRegion
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
    },
    selectedRegion: {
      get() {
        return this.$store.getters.selectedRegion;
      },
      set(value) {
        this.$store.commit("setSelectedRegion", value);
      }
    },
    selectedFire: {
      get() {
        return this.$store.getters.selectedFire;
      },
      set(value) {
        this.$store.commit("setSelectedFire", value);
        Map.methods.setFireLayer(
          this.$store.getters.map.instance,
          "phoenix-layer",
          this.$store.getters.selectedFireData.geojson
        );

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
