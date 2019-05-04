<template>
  <div class="map-settings-container" v-on:keydown.esc.capture="toggle()">
    <div class="map-settings-button-container mapboxgl-ctrl-top-right">
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button class="icon sprocket" type="button" v-on:keydown.esc="toggle()" @click="toggle()"></button>
      </div>
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button class="icon grid" type="button" @click="drawRectangle()"></button>
      </div>
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
          :class="{ 'font-weight-bold': renderFireIn3D }"
          type="button"
          @click="toggleFireIn3D()"
        >3D</button>
      </div>
      <div
        class="mapboxgl-ctrl mapboxgl-ctrl-group"
        v-show="this.$store.state.map.selectedMATSimLink != '' "
      >
        <button
          class="icon bug"
          type="button"
          @click="showDisruptionWindow = !showDisruptionWindow"
        ></button>
      </div>
    </div>

    <div class="map-overlay" v-show="isOpen">
      <div class="map-settings-panel" v-on:keydown.esc.capture="toggle()">
        <h3>Map Settings</h3>
        <label for="map-style">Map Style:</label>
        <select id="map-style" v-model="mapboxStyle">
          <option
            v-for="style in styles"
            :key="style.id"
            :value="style.id"
            :disabled="mapboxStyle==style.id"
          >{{ style.name }}</option>
        </select>
        <label for="map-region">Region:</label>
        <select id="map-region" v-model="selectedRegion">
          <option value="no-region" disabled></option>
          <option
            v-for="region in regions"
            :key="region.id"
            :value="region.id"
            :disabled="selectedRegion==region.id"
          >{{ region.name }}</option>
        </select>
        <label for="map-fire">Emergency Incident:</label>
        <select id="map-fire" v-model="selectedFire">
          <option value="no-fire" disabled></option>
          <option
            v-for="fire in firesInSelectedRegion"
            :key="fire.id"
            :value="fire.id"
            :disabled="selectedFire==fire.id"
          >{{ fire.name }}</option>
        </select>
        <label for="map-fire-opacity">Fire Opacity:</label>
        <input
          id="map-fire-opacity"
          type="number"
          min="0"
          max="1"
          step="0.01"
          v-model="fireOpacity"
        >

        <label for="map-smoke-opacity">Show Smoke:</label>
        <input id="map-smoke-opacity" type="checkbox" v-model="showSmoke">

        <label for="map-smoke-opacity">Smoke Opacity:</label>
        <input
          id="map-smoke-opacity"
          type="number"
          min="0"
          max="1"
          step="0.01"
          v-model="smokeOpacity"
          :disabled="!showSmoke"
        >
        <br>
        <br>
        <button
          style="width: 100% !important"
          class="btn btn-success"
          v-on:keydown.esc="toggle()"
          @click="toggle()"
        >Done</button>
      </div>
    </div>
    <div
      class="map-overlay"
      v-show="showDisruptionWindow && this.$store.state.map.selectedMATSimLink != ''"
    >
      <div class="save-simulation-panel">
        <h3>Disruption</h3>
        <label id="status1" class="form-label">Description</label>
        <input ref="description" id="simulation-name" placeholder type="text">

        <div class="container">
          <div class="row">
            <div class="col"/>
            <div class="col">
              Start Time
              <input
                class="form-control"
                type="time"
                value="00:00:00"
                id="example-time-input"
              >
            </div>
            <div class="col">
              End Time
              <input
                class="form-control"
                type="time"
                value="00:00:00"
                id="example-time-input"
              >
            </div>
            <div class="col-4">
              Speed
              <div class="input-group">
                <input
                  style="text-align: right;"
                  type="number"
                  class="form-control"
                  placeholder="Speed"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                >
                <div class="input-group-append">
                  <button
                    :class="!absoluteSpeed ? 'btn btn-secondary' : 'btn btn-primary'"
                    type="button"
                    @click="absoluteSpeed = true"
                  >KM/H</button>
                  <button
                    :class="absoluteSpeed ? 'btn btn-secondary' : 'btn btn-primary'"
                    type="button"
                    @click="absoluteSpeed = false"
                  >%</button>
                </div>
              </div>
            </div>
            <div class="col"/>
          </div>
        </div>

        <label id="status1" class="form-label">Affected Links</label>
        <input
          id="simulation-name"
          type="text"
          :value="this.$store.state.map.selectedMATSimLink"
          style="margin-bottom: 10px;"
        >
        <button
          style="width: 100% !important"
          class="btn btn-success"
          @click="saveDisruption()"
        >Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { PHOENIX_SET_OPACITY } from "@/store/mutation-types";
import { EMBER_SET_OPACITY } from "@/store/mutation-types";
import { MATSIM_ADD_DISRUPTION } from "@/store/mutation-types";
import { SHOW_SMOKE } from "@/store/mutation-types";

export default {
  name: "mapSettings",
  props: {},
  data: function() {
    return {
      absoluteSpeed: true,
      showDisruptionWindow: false,
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
    smokeOpacity: {
      get() {
        return this.$store.state.smoke.smokeOpacity;
      },
      set(value) {
        var decimal = /^[-+]?[0-9]+\.[0-9]+$/;
        if (!value.match(decimal)) return;

        this.$store.commit(EMBER_SET_OPACITY, parseFloat(value));
        this.$store.dispatch("resetSmokeLayers");
      }
    },
    showSmoke: {
      get() {
        return this.$store.state.smoke.showSmoke;
      },
      set(value) {
        this.$store.dispatch("showSmoke", value);
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
    },
    saveDisruption() {
      var store = this.$store;
      var mapInstance = store.state.map.mapInstance;

      var disruption = {
        affectedLinks: store.state.map.selectedMATSimLink,
        start: 0,
        end: 0,
        description: this.$refs.description.value
      };

      var filter = ["in", "ID"];

      //Add disruption to store
      store.commit(MATSIM_ADD_DISRUPTION, disruption);

      //Add each disrupted link to filter to display on disruption layer.
      store.state.map.disruptions.forEach(disruption => {
        disruption.affectedLinks.forEach(link => {
          filter.push(link);
        });
      });

      //render layer
      mapInstance.setFilter(store.state.map.disruptionMATSimLayer, filter);
      this.showDisruptionWindow = false;
      store.state.map.selectedMATSimLink = "";
    },
  }
};
</script>

<style>
.map-settings-panel {
  padding-left: 10%;
  padding-right: 10%;
}

.map-settings-panel select,
.map-settings-panel select option,
.map-settings-panel input {
  text-align: center;
  width: 100% !important;
}

.map-settings-panel select,
.map-settings-panel option {
  padding: 10px !important;
  text-align: center !important;
}

.map-settings-button-container {
  padding-top: 150px;
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

.map-overlay label,
.map-overlay h3 {
  display: block;
  margin: 10px 0 0 0;
}

.map-overlay input {
  display: inline-block;
  width: 80%;
  position: relative;
  margin: 0;
}
</style>
