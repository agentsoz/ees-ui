<template>
  <div class="map-settings-container" v-on:keydown.esc.capture="toggle()">
    <div class='map-settings-button-container mapboxgl-ctrl-top-right'>
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button class="icon sprocket" type="button" v-on:keydown.esc="toggle()" @click='toggle()'></button>
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
      styles: this.$store.getters.map.styles,
      regions: this.$store.getters.regions
    };
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.getters.mapSettingsIsOpen;
      },
      set(value) {
        this.$store.commit("mapSettingsIsOpen", value);
      }
    },
    firesInSelectedRegion() {
      return !this.$store.getters.firesInSelectedRegion ?
        [] :
        this.$store.getters.firesInSelectedRegion;
    },
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
        return !this.$store.getters.selectedRegion ?
          "no-region" :
          this.$store.getters.selectedRegion;
      },
      set(value) {
        this.toggle();
        this.$store.commit("setSelectedRegion", value);
        Map.methods.flyTo(
          this.$store.getters.map.instance,
          this.$store.getters.region(this.$store.getters.selectedRegion).center
        );
        Map.methods.loadLayers(this.$store.getters.map.instance, true);
      }
    },
    selectedFire: {
      get() {
        return this.$store.getters.selectedFire;
      },
      set(value) {
        this.toggle();
        this.$store.commit("setSelectedFire", value);
        var fireData = this.$store.getters.selectedFireData;
        Map.methods.setFireLayer(
          this.$store.getters.map.instance,
          "phoenix-layer",
          !fireData ? "" : fireData.geojson
        );
      }
    }
  },
  methods: {
    toggle: function() {
      this.$store.commit("setMapSettingsIsOpen", !this.$store.getters.mapSettingsIsOpen);
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
  background-color: transparent;
  display: inline-block;
  width: 100%;
  position: relative;
  margin: 0;
  cursor: ew-resize;
}
</style>
