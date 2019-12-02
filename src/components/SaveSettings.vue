<template>
  <div class="save-map-settings-container">
    <b-button
      variant="outline-primary"
      id="save-map-settings-toggle"
      v-on:click="SaveSimulationToggle"
      >Save</b-button
    >
    <b-button variant="outline-primary" id="create-simulation">Create</b-button>

    <div class="map-overlay" v-show="simSettingsIsOpen">
      <div class="save-simulation-panel">
        <label for="simulation-name">Simulation Name:</label>
        <input id="simulation-name" type="text" v-model="simulationName" />
        <b-button
          variant="outline-primary"
          id="save-map-settings"
          v-on:click="SaveSimulationConfig"
          >Save</b-button
        >
        <b-button
          variant="outline-primary"
          id="cancel-map-settings"
          v-on:click="SaveSimulationToggle"
          >Cancel</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
  MATSIM_SAVE_CONFIG,
  MATSIM_SETTINGS_VIS
} from "@/store/mutation-types";

export default {
  name: "saveSettings",
  props: {
    toggle: {
      default: false,
      type: Boolean
    }
  },
  data: function() {
    return {};
  },
  computed: {
    ...mapState({
      simSettingsIsOpen: state => state.simulation.simSettingsIsOpen
    }),
    ...mapGetters(["selectedRegion", "selectedFire"]),
    simulationName: {
      get() {
        return this.$store.state.simulation.simulationName;
      },
      set(value) {
        this.$store.commit("setSimulationName", value);
      }
    }
  },
  methods: {
    SaveSimulationToggle() {
      this.$store.commit(MATSIM_SETTINGS_VIS, !this.saveSimIsOpen);
    },
    SaveSimulationConfig() {
      var outputTemplate = {
        simulationName: this.simulationName,
        config: {
          ees: [
            {
              global: [
                {
                  randomSeed: "1234",
                  crs: "EPSG:28355",
                  startHHMM: "00:00"
                }
              ],

              bdi: [
                {
                  jPlanSelectionPolicy: "FIRST",
                  jAgents: "",
                  jLogLevel: "WARN",
                  jLogFile:
                    "test/output/io/github/agentsoz/ees/TypicalSummerWeekday50kTest/testTypicalSummerWeekday50k/jill.log",
                  jOutFile:
                    "test/output/io/github/agentsoz/ees//TypicalSummerWeekday50kTest/testTypicalSummerWeekday50k/jill.out"
                }
              ],

              matsim: [
                {
                  outputDir:
                    "test/output/io/github/agentsoz/ees//TypicalSummerWeekday50kTest/testTypicalSummerWeekday50k/matsim",
                  configXml:
                    "scenarios/surf-coast-shire/typical-summer-weekday-50k/scenario_matsim_main.xml",
                  maxDistanceForFireVisual: "1000",
                  maxDistanceForSmokeVisual: "5000",
                  fireAvoidanceBufferForVehicles: "5000",
                  fireAvoidanceBufferForEmergencyVehicles: "1000",
                  congestionEvaluationInterval: "180",
                  congestionToleranceThreshold: "0.33",
                  congestionReactionProbability: "0.0"
                }
              ],

              phoenix: [
                {
                  ignitionHHMM: "00:00",
                  fireGeoJson: this.selectedFire.geojson,
                  smokeGeoJson: ""
                }
              ],

              disruption: [
                {
                  fileJson:
                    "scenarios/surf-coast-shire/typical-summer-weekday-50k/scenario_disruptions.json"
                }
              ],

              messaging: [
                {
                  fileJson:
                    "scenarios/surf-coast-shire/typical-summer-weekday-50k/scenario_messages.json"
                }
              ]
            }
          ],
          scenario_main: [
            {
              matsimfile:
                "scenarios/surf-coast-shire/typical-summer-weekday-50k/scenario_matsim_main.xml",

              firefile: [
                {
                  name: "",
                  coordinates: "",
                  format: ""
                }
              ],

              geographyfile: [
                {
                  geo_name:
                    "scenarios/surf-coast-shire/typical-summer-weekday-50k/scenario_geography.xml"
                }
              ],

              trafficBehaviour: [
                {
                  proportion: "0.0",
                  radiusInMtrs: "0"
                }
              ],

              evacuationTiming: [
                {
                  start: "00:00",
                  peak: "00"
                }
              ],

              bdiagents: "bdiagents"
            }
          ]
        }
      };

      this.$store.commit(
        MATSIM_SAVE_CONFIG,
        outputTemplate,
        this.simulationName
      );

      this.SaveSimulationToggle();
    }
  }
};
</script>

<style>
#save-map-settings-toggle {
  position: absolute;
  top: 10px;
  overflow: visible;
  margin: 0 0 0 -80px;
}

#create-simulation {
  position: absolute;
  top: 10px;
  overflow: visible;
  margin: 0 0 0 0;
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

#save-map-settings {
  margin: 10px 0 0 0;
}

#cancel-map-settings {
  margin: 10px 0 0 20px;
}
</style>
