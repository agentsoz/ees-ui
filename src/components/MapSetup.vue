<template>
  <b-container fluid class="p-0 h-100 mapboxgl-ctrl-top-left map-sidebar-container">
    <b-row no-gutters>
    <b-col sm="5" class="m-0 mapboxgl-ctrl map-sidebar-col" >
      <div id="h-100 nav">
        <h5>Emergency Evacuation Simulator</h5>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
        <b-button v-b-toggle.collapse-side-panel size="sm" variant="secondary">Hide</b-button>
      </div>
      <b-collapse visible id="collapse-side-panel" class="h-100">
        <div class="h-100 map-accordion-container">

          <b-card no-body class="mb-1">
            <b-card-header v-b-toggle.collapse-map-style>
              Map Style 
            </b-card-header>
            <b-collapse visible id="collapse-map-style">           
              <select id="map-style" v-model="mapboxStyle">
                <option v-for="style in styles" :key="style.id" :value="style.id" :disabled="mapboxStyle.id == style.id">{{ style.name }}</option>
              </select>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header v-b-toggle.collapse-region>
              Region
            </b-card-header>
            <b-collapse visible id="collapse-region">
            <select id="map-region" v-model="selectedRegion">
              <option value="no-region" disabled></option>
              <option v-for="region in regions" :key="region.id" :value="region.id" :disabled="selectedRegion==region.id">{{ region.name }}</option>
            </select>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header v-b-toggle.collapse-incident>
              Emergency Incident
              <span class="helper-icons"><font-awesome-icon icon="info-circle" @click="modalShow = !modalShow"/></span>
            </b-card-header>
            <b-collapse visible id="collapse-incident">
            <b-row>
              <b-col xs="8">
                <select id="map-fire" v-model="selectedFire">
                  <option value="no-fire" disabled></option>
                  <option v-for="fire in firesInSelectedRegion" :key="fire.id" :value="fire.id" :disabled="selectedFire==fire.id">{{ fire.name }}</option>
                </select>
            </b-col>

            <b-col xs="4">
              <b-form-group>
                <b-form-checkbox-group
                  id="incident_checkbox_group"
                  v-model="incident_selected"
                  :options="incident_options"
                  name="incident"
                ></b-form-checkbox-group>
              </b-form-group>
            </b-col>
            </b-row>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header v-b-toggle.collapse-timing>
              Timing
              <span class="helper-icons"><font-awesome-icon icon="info-circle" /></span>
            </b-card-header>
            <b-collapse visible id="collapse-timing">
              <b-row>
                <b-col md="4" sm="4" xs="4">
                  <label>Evac start (24hr)</label>
                  <b-form-input v-model="text" placeholder="12:00"></b-form-input>
                </b-col>
                <b-col md="7" sm="7" xs="7">
                  <label>Evac peak (mins)</label>
                  <div>
                  <VueSlideBar
                    v-model="slider.timer_value"
                    :data="slider.timer_data"
                    :range="slider.timer_range"
                    :labelStyles="{ color: '#4a4a4a', backgroundColor: '#4a4a4a' }"
                    :processStyle="{ backgroundColor: '#d8d8d8' }"
                    @callbackRange="callbackRange">
                    <template slot="tooltip" slot-scope="tooltip">
                      <font-awesome-icon icon="map-marker" />
                    </template>
                  </VueSlideBar>
                </div>
                </b-col>
              </b-row>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header v-b-toggle.collapse-dest>
              Destinations and safe lines
              <span class="helper-icons"><font-awesome-icon icon="info-circle" /></span>
            </b-card-header>
            <b-collapse visible id="collapse-dest">
            <b-row>
            <div>
              <b-col xs="6">
              <b-form-select v-model="dest_selected" :options="dest_options"></b-form-select>
              </b-col>
              <b-col xs="5">
                <b-button disabled size="sm" variant="success"><font-awesome-icon icon="plus-circle" />Draw safe line</b-button>
              </b-col>
            </div>
            </b-row>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header v-b-toggle.collapse-traffic>
              Traffic Behaviour Setup
            </b-card-header>
            <b-collapse visible id="collapse-traffic">
            <label>
              Maximum speed on roads (as % of speed limits)
              <span class="helper-icons"><font-awesome-icon icon="info-circle" /></span>
            </label>
            <VueSlideBar
              v-model="slider.traffic_value"
              :data="slider.traffic_data"
              :range="slider.traffic_range"
              :labelStyles="{ color: '#4a4a4a', backgroundColor: '#4a4a4a' }"
              :processStyle="{ backgroundColor: '#d8d8d8' }"
              @callbackRange="callbackRange">
              <template slot="tooltip" slot-scope="tooltip">
                <font-awesome-icon icon="map-marker" />
              </template>
            </VueSlideBar>
            </b-collapse>
          </b-card>

        </div>
      </b-collapse>
    </b-col>
    </b-row>

    <b-modal v-model="modalShow" centered title="BootstrapVue">
      <p style="position:absolute; background: blue;" class="my-4">Hello from modal!</p>
    </b-modal>

  </b-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import MapAffectedLink from "@/components/MapAffectedLink.vue";
import VueSlideBar from "vue-slide-bar";
import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMapMarker, faInfoCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faMapMarker, faInfoCircle, faPlusCircle);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;

export default {
  name: "mapSetup",
  props: {},
  data: function() {
    return {
      isHidden: false,
      styles: this.$store.state.config.styles,
      regions: this.$store.state.config.regions,
      modalShow: false,
      incident_selected: ['fire'], // Must be an array reference!
      incident_options: [
          { text: 'Show on map', value: 'fire' },
          { text: 'Toggle smoke', value: 'smoke' }
        ],
      rangeValue: {},
      slider: {
        traffic_value: 0,
        traffic_data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        traffic_range: [
          {label: "|", isHide: true},
          {label: "20%"},
          {label: "|", isHide: true},
          {label: "40%"},
          {label: "|", isHide: true},
          {label: "60%"},
          {label: "|", isHide: true},
          {label: "80%"},
          {label: "|", isHide: true},
          {label: "100%"},
        ],
        timer_value: 0,
        timer_data: [0, 30, 60, 90, 120, 150, 180],
        timer_range: [
          {label: "0"},
          {label: "|", isHide: true},
          {label: "60"},
          {label: "|", isHide: true},
          {label: "120"},
          {label: "|", isHide: true},
          {label: "180"}
        ]
      },
      dest_selected: null,
      dest_options: [
        { value: null, text: 'Please select an option' },
        { value: 'a', text: 'This is First option' },
        { value: 'b', text: 'Selected Option' },
        { value: { C: '3PO' }, text: 'This is an option with object value' },
        { value: 'd', text: 'This one is disabled', disabled: true }
      ]
    };
  },
  computed: {
    ...mapState({
      populationSquares: state => state.map.populationSquares,
      selectedMATSimLink: state => state.map.selectedMATSimLink
    }),
    ...mapGetters(["selectedStyle", "selectedRegion", "selectedFire"]),
    firesInSelectedRegion() {
      return !this.$store.getters.firesInSelectedRegion
        ? []
        : this.$store.getters.firesInSelectedRegion;
    },
    mapboxStyle: {
      get() {
        return this.$store.state.map.mapboxStyle;
      },
      set(value) {
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
        // set the selected region in state
        this.selectRegion(value);
      }
    },
    selectedFire: {
      get() {
        return !this.$store.state.fire.selectedFire
          ? "no-fire"
          : this.$store.state.fire.selectedFire;
      },
      set(value) {
        this.selectFire(value);
      }
    },
  },
  components: {
    mapAffectedLink: MapAffectedLink,
    VueSlideBar
  },
  methods: {
    ...mapActions(["selectRegion", "changeMapboxStyle", "selectFire"]),
    setStyle: function(event) {
      this.changeMapboxStyle(event.target.dataset.mapStyle);
    },
    setRegion: function(event) {
      // set the selected region in state
      this.selectRegion(event.target.dataset.region);
    },
    setFire: function(event) {
      this.selectFire(event.target.dataset.fire);
    },
    drawRectangle() {
      this.$store.commit("drawPopulationSquare");
    },
    toggle() {
      this.isHidden = !this.isHidden;
    },
    callbackRange(val) {
      this.rangeValue = val;
    }
  }
};
</script>

<style>
#nav {
  width: 100%;
  position: absolute;
  left: 0;
}
.map-sidebar-container {
}
.map-accordion-container {
  text-align: left;
  padding: 20px;
}
.map-sidebar-container .map-sidebar-col {
  background-color: rgba(255, 255, 255, 0.8);
  overflow-y: auto;
}
.helper-icons{
  position:relative;
  left: 5px;
}

</style>
