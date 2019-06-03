<template>
  <b-container
    v-show="this.$store.state.map.mapSettingsIsOpen"
    fluid
    class="p-0 h-100 mapboxgl-ctrl-top-left map-sidebar-container"
  >
    <b-row no-gutters class="h-100">
      <b-col sm="5" class="h-100 m-0 mapboxgl-ctrl map-sidebar-col">
        <div id="h-100 nav">
          <h5>Emergency Evacuation Simulator</h5>
          <router-link to="/">Home</router-link>|
          <router-link to="/about">About</router-link>
        </div>
        <b-collapse visible id="collapse-side-panel" class="h-100">
          <div class="h-100 map-accordion-container">
            <b-card no-body class="mb-1">
              <b-card-header v-b-toggle.collapse-map-style>Map Style</b-card-header>
              <b-collapse visible id="collapse-map-style">
                <b-form-select v-model="mapboxStyle">
                  <option
                    v-for="style in styles"
                    :key="style.id"
                    :value="style.id"
                    :disabled="mapboxStyle.id == style.id"
                  >{{ style.name }}</option>
                </b-form-select>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-row>
                <b-col>
                  <b-card-header>Region</b-card-header>
                  <b-collapse visible id="collapse-region">
                    <b-form-select id="map-region" v-model="selectedRegion">
                      <option value="no-region" text="no-region" disabled></option>
                      <option
                        v-for="region in regions"
                        :key="region.id"
                        :value="region.id"
                        :disabled="selectedRegion == region.id"
                      >{{ region.name }}</option>
                    </b-form-select>
                  </b-collapse>
                </b-col>
                <b-col>
                  <b-card-header>Population</b-card-header>
                  <b-collapse visible id="collapse-region">
                    <b-form-select id="map-region" v-model="selectedPopulation">
                      <option value="no-region" text="no-region" disabled></option>
                      <option
                        v-for="population in populations"
                        :key="population.population"
                        :value="population.population"
                      >{{ population.population }}</option>
                    </b-form-select>
                  </b-collapse>
                </b-col>
              </b-row>
              <b-col>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox1"
                    :checked="showHomeLayer"
                    v-on:click="hideLayer('activities_home')"
                    :disabled="!loadedHomeLayer"
                  >
                  <label class="form-check-label" for="inlineCheckbox1">Home</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox1"
                    value="option1"
                    :checked="showWorkLayer"
                    v-on:click="hideLayer('activities_work')"
                    :disabled="!loadedWorkLayer"
                  >
                  <label class="form-check-label" for="inlineCheckbox1">Work</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox1"
                    :checked="showBeachLayer"
                    v-on:click="hideLayer('activities_beach')"
                    :disabled="!loadedBeachLayer"
                  >
                  <label class="form-check-label" for="inlineCheckbox1">Beach</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox1"
                    :checked="showShopLayer"
                    v-on:click="hideLayer('activities_shops')"
                    :disabled="!loadedShopLayer"
                  >
                  <label class="form-check-label" for="inlineCheckbox1">Shop</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox1"
                    :checked="showOtherLayer"
                    v-on:click="hideLayer('activities_other')"
                    :disabled="!loadedOtherLayer"
                  >
                  <label class="form-check-label" for="inlineCheckbox1">Other</label>
                </div>
              </b-col>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header v-b-toggle.collapse-incident>
                Emergency Incident
                <span class="helper-icons">
                  <font-awesome-icon icon="info-circle" v-b-popover.hover="helperOptions[0].text"/>
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
                      >{{ fire.name }}</option>
                    </b-form-select>
                  </b-col>
                  <b-col md="4" sm="4" xs="4">
                    <b-form-group>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox1"
                          value="option1"
                          v-model="showSmoke"
                          :disabled="this.$store.state.fire.selectedFire == null"
                        >
                        <label class="form-check-label" for="inlineCheckbox1">Smoke</label>
                      </div>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <label>Fire Opacity</label>

                    <input
                      class="form-control"
                      type="number"
                      value="0.7"
                      step="0.1"
                      v-model="fireOpacity"
                      :disabled="this.$store.state.fire.selectedFire == null"
                    >
                  </b-col>
                  <b-col>
                    <label>Smoke Opacity</label>

                    <input
                      class="form-control"
                      type="number"
                      value="0.5"
                      step="0.1"
                      v-model="smokeOpacity"
                      :disabled="this.$store.state.fire.selectedFire == null"
                    >
                  </b-col>
                </b-row>
              </b-collapse>
            </b-card>
            <!--<b-card no-body class="mb-1">
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
                  <b-col md="6" sm="6" xs="6">
                    <b-form-select
                      v-model="dest_selected"
                      :options="dest_options"
                      disabled
                    >
                    </b-form-select>
                  </b-col>
                  <b-col md="5" sm="5" xs="5">
                    <b-button disabled size="sm" variant="success">
                      <font-awesome-icon icon="plus-circle" />
                      Draw safe line
                    </b-button>
                  </b-col>
                </b-row>
              </b-collapse>
            </b-card>-->
            <b-card no-body class="mb-1">
              <b-card-header v-b-toggle.collapse-traffic>Traffic Behaviour Setup</b-card-header>
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
                  v-model="trafficSlider.value"
                  :data="trafficSlider.data"
                  :range="trafficSlider.range"
                  @callbackRange="callbackRange"
                >
                  <template slot="tooltip" slot-scope="tooltip">
                    <img src="../assets/rectangle-slider.png">
                  </template>
                </VueSlideBar>
              </b-collapse>
            </b-card>s
          </div>
        </b-collapse>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { PHOENIX_SET_OPACITY } from "@/store/mutation-types";
import { EMBER_SET_OPACITY } from "@/store/mutation-types";
import { SHOW_SMOKE } from "@/store/mutation-types";
import MapAffectedLink from "@/components/MapAffectedLink.vue";
import VueSlideBar from "vue-slide-bar";
import Vue from "vue";
import { library, layer } from "@fortawesome/fontawesome-svg-core";
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
      loadedHomeLayer: false,
      loadedWorkLayer: false,
      loadedBeachLayer: false,
      loadedOtherLayer: false,
      loadedShopLayer: false,

      showHomeLayer: false,
      showWorkLayer: false,
      showBeachLayer: false,
      showOtherLayer: false,
      showShopLayer: false,

      isHidden: false,
      styles: this.$store.state.config.styles,
      regions: this.$store.state.config.regions,
      populations: [{ population: "default" }],
      modalShow: false,
      //incident_selected: ["fire"], // Must be an array reference!
      incident_options: [
        { text: "Show on map", value: "fire" },
        { text: "Toggle smoker", value: "smoke" }
      ],
      rangeValue: {},
      trafficSlider: {
        // Traffic Behaviour Setup
        value: 0,
        data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        range: [
          { label: "0" },
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
        rangeValue: {}
      },
      global: [{ text: "startHHMM", value: "00:00" }],
      phoenix: [
        { text: "ignitionHHMM", value: "00:00" },
        {
          text: "fireGeoJson",
          value: "scenarios/surf-coast-shire/test-files/scenario_fire.json"
        },
        { text: "smokeGeoJson", value: "" }
      ],
      matsim: [
        {
          text: "outputDir",
          value:
            "test/output/io/github/agentsoz/ees//TypicalSummerWeekday50kTest/testTypicalSummerWeekday50k/matsim"
        },
        {
          text: "configXml",
          value:
            "scenarios/surf-coast-shire/test-files/scenario_matsim_main.xml"
        },
        { text: "maxDistanceForFireVisual", value: "1000" },
        { text: "maxDistanceForSmokeVisual", value: "5000" },
        { text: "fireAvoidanceBufferForVehicles", value: "5000" },
        { text: "fireAvoidanceBufferForEmergencyVehicles", value: "1000" },
        { text: "congestionEvaluationInterval", value: "180" },
        { text: "congestionToleranceThreshold", value: "0.33" },
        { text: "congestionReactionProbability", value: "0.0" }
      ],
      trafficBehaviour: [
        { text: "proportion", value: "0.0" },
        { text: "radiusInMtrs", value: "0" }
      ],
      dest_selected: null,
      dest_options: [{ value: null, text: "Please select an option" }],
      helperOptions: [
        {
          value: 0,
          text:
            "If the location chosen has fire models, choose which one to use. Select whether to show visually on map.\nEvacuation can proceed without fire model, in which case No incident should be selected. If a fire model is selected, key attributes are displayed."
        },
        {
          value: 1,
          text:
            "Evac start is the time at which evacuation starts (announcement is made).\nIf there is a fire model, this should be some time after fire ignition attribute of chosen fire.\nEvac peak is the length of time after the start, at which the largest number of people are starting to leave.\nEvacuations are dispersed around the peak point."
        },
        {
          value: 2,
          text:
            "Potential destinations are indicated in location file. These provide direction of evacuation. If multiple destinations are given, evacuation is split between these (currently an equal split - future work will allow user specification).\nThe safe line is a line beyond which evacuees can be considered out of danger. Safe lines should be sufficiently long to cut all possible roads that could be used to a given destination. Only one safe line is allowed per destination. To draw line, click start point, release, click end point."
        },
        {
          value: 3,
          text:
            "The simulator will modify speeds based on congestion. However in a bushfire additional factors (e.g. smoke) may affect possible speed. This allows that to be specified as a % of the normal speed. The setting will affect all roads in the network, not only those near the fire."
        }
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
        // this.populations = [{population: "Default"}]
        // set the selected region in state
        this.selectRegion(value);
      }
    },
    selectedPopulation: {
      get() {
        return null;
      },
      set(value) {
        var map = this.$store.state.map.mapInstance;
        const axios = require("axios");
        var activities = [
          { key: "activities_home" },
          { key: "activities_work" },
          { key: "activities_beach" },
          { key: "activities_shops" },
          { key: "activities_other" }
        ];
        let self = this;
        activities.filter(function(activity) {
          axios
            .post(process.env.VUE_APP_EES_TILES_API + "/get-population", activity)
            .then(resp => {
              // json = json.replace(/\"([^(\")"]+)\":/g, "$1:"); //This will remove quotes from properties in object.
              map.addSource(activity.key, {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: resp.data
                }
              });

              map.addLayer({
                id: activity.key,
                type: "circle",
                source: activity.key,
                paint: {
                  "circle-radius": {
                    base: 1.75,
                    stops: [[12, 2], [22, 180]]
                  },
                  "circle-color": "red"
                }
              });
              switch (activity.key) {
                case "activities_work":
                  self.loadedWorkLayer = true;
                  self.showWorkLayer = true;
                  break;
                case "activities_home":
                  self.loadedHomeLayer = true;
                  self.showHomeLayer = true;
                  break;
                case "activities_shops":
                  self.loadedShopLayer = true;
                  self.showShopLayer = true;
                  break;
                case "activities_other":
                  self.loadedOtherLayer = true;
                  self.showOtherLayer = true;
                  break;
                case "activities_beach":
                  self.loadedBeachLayer = true;
                  self.showBeachLayer = true;
                  break;
              }
            });
        });
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
    selectedIncident: {
      get() {
        return ["fire"];
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
    callbackRange(val) {
      this.trafficSlider.rangeValue = val;
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
    hideLayer(layerid) {
      var visibility;

      switch (layerid) {
        case "activities_work":
          visibility = this.showWorkLayer = !this.showWorkLayer;
          break;
        case "activities_home":
          visibility = this.showHomeLayer = !this.showHomeLayer;
          break;
        case "activities_shops":
          visibility = this.showShopLayer = !this.showShopLayer;
          break;
        case "activities_other":
          visibility = this.showOtherLayer = !this.showOtherLayer;
          break;
        case "activities_beach":
          visibility = this.showBeachLayer = !this.showBeachLayer;
          break;
      }
      var map = this.$store.state.map.mapInstance;
      visibility = !visibility;
      map.setLayoutProperty(
        layerid,
        "visibility",
        visibility ? "none" : "visible"
      );
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
} /*
.vue-slide-bar-component[data-v-68863e48] {
  padding-left: 5% !important;
  padding-right: 5% !important;
}*/
</style>
