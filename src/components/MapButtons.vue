<template>
  <div class="map-settings-container" v-on:keydown.esc.capture="toggle()">
    <div class="map-settings-hamburger mapboxgl-ctrl-top-left">
      <button
        class="pt-2 pb-1 px-3 mapboxgl-ctrl mapboxgl-ctrl-group"
        type="button"
        v-on:keydown.esc="toggle()"
        @click="toggle()"
      >
        <FontAwesomeIcon icon="bars" size="2x" />
      </button>
    </div>
    <div
      z-index="10000"
      class="map-settings-button-container mapboxgl-ctrl-top-right"
    >
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
          class="icon polygon"
          type="button"
          @click="drawRectangle()"
        ></button>
      </div>
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
          :class="{ 'font-weight-bold': renderFireIn3D }"
          type="button"
          @click="toggleFireIn3D()"
        >
          3D
        </button>
      </div>
      <div
        class="mapboxgl-ctrl mapboxgl-ctrl-group"
        v-show="
          this.$store.state.map.selectedMATSimLink != '' ||
            this.showDisruptionWindow
        "
      >
        <button
          class="icon bug"
          type="button"
          @click="showDisruptionWindow = !showDisruptionWindow"
          :style="
            this.showDisruptionWindow ? 'background-color: lightskyblue;' : ''
          "
        ></button>
      </div>
    </div>
    <div class="map-overlay" v-show="showDisruptionWindow">
      <div v-if="!isLinkDisrupted()" class="save-simulation-panel">
        <h3>Disruption</h3>

        <label id="status1" class="form-label">Description</label>
        <input ref="description" id="simulation-name" placeholder type="text" />

        <div class="container">
          <div class="row">
            <div class="col" />
            <div class="col">
              Start Time
              <input
                ref="startTime"
                class="form-control"
                type="time"
                value="00:00:00"
                id="example-time-input"
              />
            </div>
            <div class="col">
              End Time
              <input
                ref="endTime"
                class="form-control"
                type="time"
                value="00:00:00"
                id="example-time-input"
              />
            </div>
            <div class="col-4">
              Speed
              <div class="input-group">
                <input
                  ref="speed"
                  style="text-align: right;"
                  type="number"
                  class="form-control"
                  placeholder="Speed"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
                <div class="input-group-append">
                  <button
                    :class="
                      !absoluteSpeed ? 'btn btn-secondary' : 'btn btn-primary'
                    "
                    type="button"
                    @click="absoluteSpeed = true"
                  >
                    KM/H
                  </button>
                  <button
                    :class="
                      absoluteSpeed ? 'btn btn-secondary' : 'btn btn-primary'
                    "
                    type="button"
                    @click="absoluteSpeed = false"
                  >
                    %
                  </button>
                </div>
              </div>
            </div>
            <div class="col" />
          </div>
        </div>

        <label id="status1" class="form-label">Affected Links</label>
        <input
          id="simulation-name"
          type="text"
          :value="this.$store.state.map.selectedMATSimLink"
          style="margin-bottom: 10px;"
          disabled
        />
        <button
          v-if="this.$store.state.map.selectedMATSimLink != ''"
          style="width: 100% !important"
          class="btn btn-success"
          @click="saveDisruption()"
        >
          Save
        </button>
        <button
          v-else
          style="width: 100% !important"
          class="btn btn-success"
          disabled
          @click="saveDisruption()"
        >
          Save
        </button>
      </div>
      <div v-else class="save-simulation-panel">
        <h3>Disruption</h3>
        <button
          style="width: 100% !important"
          class="btn btn-danger"
          @click="deleteDisruption()"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faBars);

import { mapActions } from "vuex";
import {
  MATSIM_ADD_DISRUPTION,
  MATSIM_DESELECT_LINK
} from "@/store/mutation-types";

export default {
  name: "mapButtons",
  props: {},
  components: { FontAwesomeIcon },
  data: function() {
    return {
      absoluteSpeed: true,
      showDisruptionWindow: false,
      styles: this.$store.state.config.styles,
      regions: this.$store.state.config.regions
    };
  },
  computed: {
    renderFireIn3D: {
      get() {
        return this.$store.state.fire.fire3DFlameHeight;
      }
    }
  },
  methods: {
    ...mapActions({
      toggleFireIn3D: "toggleFireIn3D",
      toggle: "toggleSettingsVis"
    }),
    drawRectangle() {
      this.$store.commit("drawPopulationSquare");
    },
    saveDisruption() {
      var store = this.$store;
      var mapInstance = store.state.map.mapInstance;

      var disruption = {
        affectedLinks: store.state.map.selectedMATSimLink,
        start: this.$refs.startTime.value,
        end: this.$refs.endTime.value,
        description: this.$refs.description.value,
        speed: this.$refs.speed.value,
        absoluteSpeed: this.absoluteSpeed
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
    isLinkDisrupted() {
      var selectedLink = this.$store.state.map.selectedMATSimLink;
      var disruptions = this.$store.state.map.disruptions;
      var result = false;
      disruptions.forEach(disruption => {
        disruption.affectedLinks.forEach(link => {
          if (link == selectedLink) {
            result = true;
          }
        });
      });
      return result;
    },
    deleteDisruption() {
      var selectedLink = this.$store.state.map.selectedMATSimLink;
      var disruptions = this.$store.state.map.disruptions;
      var store = this.$store;
      var filter = ["in", "ID"];

      this.showDisruptionWindow = false;

      disruptions.forEach(function(disruption, i) {
        disruption.affectedLinks.forEach(link => {
          if (link == selectedLink) {
            delete disruptions[i];
          }
        });
      });

      store.state.map.mapInstance.setFilter(
        store.state.map.selectedDisruptionMATSimLayer,
        filter
      );

      // this.showDisruptionWindow = false;

      // Add each disrupted link to filter to display on disruption layer.
      disruptions.forEach(disruption => {
        disruption.affectedLinks.forEach(link => {
          filter.push(link);
        });
      });
      //render layer
      store.state.map.mapInstance.setFilter(
        store.state.map.disruptionMATSimLayer,
        filter
      );
      store.commit(MATSIM_DESELECT_LINK, null);
    }
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

.map-settings-hamburger {
  padding-top: 10px;
  padding-left: 20px;
}
.map-settings-hamburger .mapboxgl-ctrl-group {
  margin: 0;
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
