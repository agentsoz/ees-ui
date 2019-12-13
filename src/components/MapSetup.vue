<template>
  <b-container
    v-show="
      this.$store.state.map.mapInstance != null &&
        (this.$store.state.config.data != null || this.error != null) &&
        this.$store.state.map.mapSettingsIsOpen
    "
    fluid
    class="p-0 h-100 mapboxgl-ctrl-top-left map-sidebar-container"
  >
    <b-row no-gutters class="h-100">
      <b-col sm="5" class="h-100 m-0 pt-2 mapboxgl-ctrl map-sidebar-col">
        <div id="h-100 nav">
          <h5>Emergency Evacuation Simulator</h5>
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </div>
        <b-collapse visible id="collapse-side-panel" class="h-100">
          <div class="h-100 map-accordion-container">
            <b-alert
              show
              v-if="this.error != null"
              variant="danger"
              v-html="this.error"
            ></b-alert>
            <b-card header="Scenario" class="mb-1 p-0">
              <b-form-group
                label-cols-sm="12"
                label-cols-lg="4"
                label="Region"
                label-for="map-region"
              >
                <b-form-select id="map-region" v-model="selectedRegion">
                  <option value="any-region">(any)</option>
                  <option
                    v-for="(r, id) in regions"
                    :key="id"
                    :value="id"
                    :disabled="selectedRegion == id"
                    >{{ r.name }}</option
                  >
                </b-form-select>
              </b-form-group>
              <b-form-group
                label-cols-sm="12"
                label-cols-lg="4"
                label="Population"
                label-for="map-population"
              >
                <b-form-select id="map-population" v-model="selectedPopulation">
                  <option value="no-population">None</option>
                  <option
                    v-for="(p, id) in popInSelectedRegion"
                    :key="id"
                    :value="id"
                    :disabled="selectedPopulation == id"
                    >{{ p.display_name }}</option
                  >
                </b-form-select>
              </b-form-group>
            </b-card>
            <b-card class="mb-1">
              <template v-slot:header>
                <h6 class="mb-0">
                  Emergency Incident
                  <span class="helper-icons">
                    <FontAwesomeIcon
                      icon="info-circle"
                      v-b-popover.hover="helperOptions[0].text"
                    />
                  </span>
                </h6>
              </template>
              <b-collapse visible id="collapse-incident">
                <b-form inline>
                  <b-form-select id="map-fire" v-model="selectedFire">
                    <option value="no-fire" disabled></option>
                    <option
                      v-for="(f, id) in firesInSelectedRegion"
                      :key="id"
                      :value="id"
                      :disabled="selectedFire == id"
                      >{{ f.display_name }}</option
                    >
                  </b-form-select>
                  <b-form-checkbox
                    class="ml-2 form-check-input"
                    v-model="showSmoke"
                    :disabled="this.$store.state.fire.selectedFire == null"
                    >Display Embers
                  </b-form-checkbox>
                </b-form>
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
            <MapTrafficBehaviourCard
              :helpText="helperOptions[3].text"
              :trafficSpeed="100"
            />
            <b-card class="mb-1" header="UI Settings">
              <b-collapse visible id="collapse-map-style">
                <b-form>
                  <b-form-group
                    label-cols-sm="12"
                    label-cols-lg="8"
                    label="Map Style"
                    label-for="map-style"
                  >
                    <b-form-select id="map-style" v-model="mapboxStyle">
                      <option
                        v-for="style in styles"
                        :key="style.id"
                        :value="style.id"
                        :disabled="mapboxStyle.id == style.id"
                        >{{ style.name }}</option
                      >
                    </b-form-select>
                  </b-form-group>
                  <b-form-group
                    label-cols-sm="12"
                    label-cols-lg="8"
                    label="Fire Opacity"
                    label-for="fire_opacity"
                  >
                    <b-form-input
                      id="fire_opacity"
                      type="number"
                      value="0.7"
                      step="0.1"
                      min="0"
                      max="1"
                      v-model="fireOpacity"
                      :disabled="this.$store.state.fire.selectedFire == null"
                    />
                  </b-form-group>
                  <b-form-group
                    label-cols-sm="12"
                    label-cols-lg="8"
                    label="Smoke Opacity"
                    label-for="smoke_opacity"
                  >
                    <b-form-input
                      id="smoke_opacity"
                      type="number"
                      value="0.5"
                      step="0.1"
                      min="0"
                      max="1"
                      v-model="smokeOpacity"
                      :disabled="this.$store.state.fire.selectedFire == null"
                    />
                  </b-form-group>
                  <b-form-group
                    label-cols-sm="12"
                    label-cols-lg="8"
                    label="Population Opacity"
                    label-for="population_opacity"
                  >
                    <b-form-input
                      id="population_opacity"
                      type="number"
                      value="0.5"
                      step="0.1"
                      min="0"
                      max="1"
                      v-model="popOpacity"
                    />
                  </b-form-group>
                </b-form>
              </b-collapse>
            </b-card>
            <br />
            <br />
            <br />
          </div>
        </b-collapse>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { EMBER_SET_OPACITY } from "@/store/mutation-types";
import { DRAW_SMOKE, CLEAR_SMOKE } from "@/store/mutation-types";
import MapAffectedLink from "@/components/MapAffectedLink.vue";
import MapTrafficBehaviourCard from "@/components/MapTrafficBehaviourCard.vue";
import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMapMarker,
  faInfoCircle,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faMapMarker, faInfoCircle, faPlusCircle);
Vue.config.productionTip = false;

export default {
  name: "mapSetup",
  props: {},
  data: function() {
    return {
      isHidden: false,
      styles: this.$store.state.config.styles,
      populations: this.$store.state.config.populations,
      modalShow: false,
      //incident_selected: ["fire"], // Must be an array reference!
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
      selectedMATSimLink: state => state.map.selectedMATSimLink,
      error: state => state.config.error
    }),
    ...mapGetters([
      "regions",
      "selectedStyle",
      "selectedRegion",
      "popInSelectedRegion",
      "population/selected"
    ]),
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
        // loadLayersOnStyleChange triggers 'loadLayers' once mapbox is done
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
    selectedPopulation: {
      get() {
        return !this.$store.state.population.selected
          ? "no-population"
          : this.$store.state.population.selected;
      },
      set(value) {
        this["population/select"](value);
      }
    },
    selectedFire: {
      get() {
        return !this.$store.state.fire.selectedFire
          ? "no-fire"
          : this.$store.state.fire.selectedFire;
      },
      set(value) {
        this["fire/select"](value);
      }
    },
    selectedIncident: {
      get() {
        return ["fire"];
      }
    },
    showSmoke: {
      get() {
        return this.$store.state.smoke.smokeVisible;
      },
      set(value) {
        // make smoke visible
        this.$store.commit(DRAW_SMOKE, value);
        if (value) {
          // reload any layers to apply this change
          this.$store.dispatch("drawSmoke");
        } else {
          // remove smoke
          this.$store.commit(CLEAR_SMOKE, this.$store.state.map.mapInstance);
        }
      }
    },
    fireOpacity: {
      get() {
        return this.$store.state.fire.opacity;
      },
      set(value) {
        var decimal = /^[-+]?[0-9]+\.[0-9]+$/;
        if (!value.match(decimal)) return;

        this.$store.dispatch("fire/setOpacity", parseFloat(value));
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
        this.$store.dispatch("resetFireLayers");
      }
    },
    popOpacity: {
      get() {
        return this.$store.state.population.opacity;
      },
      set(value) {
        var decimal = /^[-+]?[0-9]+\.[0-9]+$/;
        if (!value.match(decimal)) return;

        this.$store.dispatch("population/setOpacity", parseFloat(value));
      }
    }
  },

  components: {
    mapAffectedLink: MapAffectedLink,
    MapTrafficBehaviourCard,
    FontAwesomeIcon
  },
  methods: {
    ...mapActions([
      "selectRegion",
      "changeMapboxStyle",
      "fire/select",
      "population/select"
    ]),
    setRegion: function(event) {
      // set the selected region in state
      this.selectRegion(event.target.dataset.region);
    },
    drawRectangle() {
      this.$store.commit("drawPopulationSquare");
    },
    toggle() {
      this.isHidden = !this.isHidden;
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
.map-sidebar-container .card-body {
  padding: 1em;
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
.vue-slide-bar-component[data-v-68863e48] {
  padding-left: 5% !important;
  padding-right: 5% !important;
}
</style>
