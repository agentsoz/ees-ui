<template>
  <b-container
    fluid
    class="p-0 h-100 mapboxgl-ctrl-top-left map-sidebar-container"
  >
    <b-row no-gutters>
      <b-col sm="5" class="m-0 mapboxgl-ctrl map-sidebar-col">
        <div id="h-100 nav">
          <h5>Emergency Evacuation Simulator</h5>
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
          <b-button
            v-b-toggle.collapse-side-panel
            size="sm"
            variant="secondary"
          >
            Hide
          </b-button>
        </div>
        <b-collapse visible id="collapse-side-panel" class="h-100">
          <div class="h-100 map-accordion-container">
            <b-card no-body class="mb-1">
              <b-card-header v-b-toggle.collapse-map-style>
                Map Style
              </b-card-header>
              <b-collapse visible id="collapse-map-style">
                <b-form-select v-model="mapboxStyle">
                  <option
                    v-for="style in styles"
                    :key="style.id"
                    :value="style.id"
                    :disabled="mapboxStyle.id == style.id"
                  >
                    {{ style.name }}
                  </option>
                </b-form-select>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header v-b-toggle.collapse-region>
                Region
              </b-card-header>
              <b-collapse visible id="collapse-region">
                <b-form-select id="map-region" v-model="selectedRegion">
                  <option value="no-region" disabled></option>
                  <option
                    v-for="region in regions"
                    :key="region.id"
                    :value="region.id"
                    :disabled="selectedRegion == region.id"
                  >
                    {{ region.name }}
                  </option>
                </b-form-select>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header v-b-toggle.collapse-incident>
                Emergency Incident
                <span class="helper-icons">
                  <font-awesome-icon
                    icon="info-circle"
                    v-b-popover.hover="helperOptions[0].text"
                  />
                </span>
              </b-card-header>
              <b-collapse visible id="collapse-incident">
                <b-row>
                  <b-col md="8" sm="8" xs="8">
                    <b-form-select id="map-fire" v-model="selectedFire">
                      <option value="no-fire" disabled></option>
                      <option
                        v-for="fire in firesInSelectedRegion"
                        :key="fire.id"
                        :value="fire.id"
                        :disabled="selectedFire == fire.id"
                      >
                        {{ fire.name }}
                      </option>
                    </b-form-select>
                  </b-col>
                  <b-col md="4" sm="4" xs="4">
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
                <span class="helper-icons">
                  <font-awesome-icon
                    icon="info-circle"
                    v-b-popover.hover="helperOptions[1].text"
                  />
                </span>
              </b-card-header>
              <b-collapse visible id="collapse-timing">
                <b-row>
                  <b-col md="4" sm="4" xs="4">
                    <label>Evac start (24hr)</label>
                    <b-row>
                      <b-col>
                        <b-form-select
                          v-model="hr_selected"
                          :options="evac_hr_options"
                        >
                        </b-form-select>
                      </b-col>
                      :
                      <b-col>
                        <b-form-select
                          v-model="min_selected"
                          :options="evac_min_options"
                        >
                        </b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="8" sm="8" xs="8">
                    <label>Evac peak (mins)</label>
                    <div>
                      <VueSlideBar
                        v-model="slider.timer_value"
                        :data="slider.timer_data"
                        :range="slider.timer_range"
                        :labelStyles="{
                          color: '#4a4a4a',
                          backgroundColor: '#4a4a4a'
                        }"
                        :processStyle="{ backgroundColor: '#d8d8d8' }"
                        @callbackRange="callbackRange"
                      >
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
                <span class="helper-icons">
                  <font-awesome-icon
                    icon="info-circle"
                    v-b-popover.hover="helperOptions[2].text"
                  />
                </span>
              </b-card-header>
              <b-collapse visible id="collapse-dest">
                <b-row>
                  <div>
                    <b-col xs="6">
                      <b-form-select
                        v-model="dest_selected"
                        :options="dest_options"
                      >
                      </b-form-select>
                    </b-col>
                    <b-col xs="5">
                      <b-button disabled size="sm" variant="success">
                        <font-awesome-icon icon="plus-circle" />
                        Draw safe line
                      </b-button>
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
                  <span class="helper-icons">
                    <font-awesome-icon
                      icon="info-circle"
                      v-b-popover.hover="helperOptions[3].text"
                    />
                  </span>
                </label>
                <VueSlideBar
                  v-model="slider.traffic_value"
                  :data="slider.traffic_data"
                  :range="slider.traffic_range"
                  :labelStyles="{
                    color: '#4a4a4a',
                    backgroundColor: '#4a4a4a'
                  }"
                  :processStyle="{ backgroundColor: '#d8d8d8' }"
                  @callbackRange="callbackRange"
                >
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
  </b-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import MapAffectedLink from "@/components/MapAffectedLink.vue";
import VueSlideBar from "vue-slide-bar";
import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMapMarker,
  faInfoCircle,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
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
      incident_selected: ["fire"], // Must be an array reference!
      incident_options: [
        { text: "Show on map", value: "fire" },
        { text: "Toggle smoke", value: "smoke" }
      ],
      rangeValue: {},
      slider: {
        // Traffic Behaviour Setup
        traffic_value: 0,
        traffic_data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        traffic_range: [
          { label: "|", isHide: true },
          { label: "20%" },
          { label: "|", isHide: true },
          { label: "40%" },
          { label: "|", isHide: true },
          { label: "60%" },
          { label: "|", isHide: true },
          { label: "80%" },
          { label: "|", isHide: true },
          { label: "100%" }
        ],
        // Time - Evac Peak (mins)
        timer_value: 0,
        timer_data: [0, 30, 60, 90, 120, 150, 180],
        timer_range: [
          { label: "0" },
          { label: "|", isHide: true },
          { label: "60" },
          { label: "|", isHide: true },
          { label: "120" },
          { label: "|", isHide: true },
          { label: "180" }
        ]
      },
      dest_selected: null,
      dest_options: [
        { value: null, text: "Please select an option" },
        { value: "a", text: "This is First option" },
        { value: "b", text: "Selected Option" },
        { value: { C: "3PO" }, text: "This is an option with object value" },
        { value: "d", text: "This one is disabled", disabled: true }
      ],
      hr_selected: "12",
      evac_hr_options: [
        { value: 1, text: "01" },
        { value: 2, text: "02" },
        { value: 3, text: "03" },
        { value: 4, text: "04" },
        { value: 5, text: "05" },
        { value: 6, text: "06" },
        { value: 7, text: "07" },
        { value: 8, text: "08" },
        { value: 9, text: "09" },
        { value: 10, text: "10" },
        { value: 11, text: "11" },
        { value: 12, text: "12" },
        { value: 13, text: "13" },
        { value: 14, text: "14" },
        { value: 15, text: "15" },
        { value: 16, text: "16" },
        { value: 17, text: "17" },
        { value: 18, text: "18" },
        { value: 19, text: "19" },
        { value: 20, text: "20" },
        { value: 21, text: "21" },
        { value: 22, text: "22" },
        { value: 23, text: "23" },
        { value: 24, text: "24" }
      ],
      min_selected: "00",
      evac_min_options: [
        { value: 0, text: "00" },
        { value: 15, text: "15" },
        { value: 30, text: "30" },
        { value: 45, text: "45" }
      ],
      helperOptions: [
        { value: 0, text: "If the location chosen has fire models, choose which one to use. Select whether to show visually on map. Evacuation can proceed without fire model, in which case No incident should be selected. If a fire model is selected, key attributes are displayed."},
        { value: 1, text: "Evac start is the time at which evacuation starts (announcement is made).\nIf there is a fire model, this should be some time after fire ignition attribute of chosen fire.\nEvac peak is the length of time after the start, at which the largest number of people are starting to leave.\nEvacuations are dispersed around the peak point."},
        { value: 2, text: "Potential destinations are indicated in location file. These provide direction of evacuation. If multiple destinations are given, evacuation is split between these (currently an equal split - future work will allow user specification). The safe line is a line beyond which evacuees can be considered out of danger. Safe lines should be sufficiently long to cut all possible roads that could be used to a given destination. Only one safe line is allowed per destination. To draw line, click start point, release, click end point."},
        { value: 3, text: "The simulator will modify speeds based on congestion. However in a bushfire additional factors (e.g. smoke) may affect possible speed. This allows that to be specified as a % of the normal speed. The setting will affect all roads in the network, not only those near the fire." }
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
    selectedHr: {
      get() {
        return this.selected_hr;
      },
      set(value) {
        this.selected_hr(value);
      }
    },
    selectedMin: {
      get() {
        return this.selected_min;
      },
      set(value) {
        this.selected_min(value);
      }
    }
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
    },
    changeTime(val) {
      if (val.length == 4) {
        if (val.charAt(2) == ":") {
          var temp = new Array();
          temp = val.split(":");
          if (temp[0] <= 12) {
            if (temp[1] <= 59) {
              this.evac_time = temp[0] + ":" + temp[1];
            }
          }
        }
      } else {
        this.evac_time = "0:00";
      }
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
.helper-icons {
  position: relative;
  left: 5px;
}
.custom-select {
  width: 50% @important;
}
</style>
