<template>
<div class="save-map-settings-container">
  <b-button v-if="!this.toggle" variant="outline-primary" id="save-map-settings" v-on:click="convertSettingsToJson">Save</b-button>
  <b-button v-if="this.toggle" variant="success" id="saved-map-settings">Success</b-button>
</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "saveSettings",
  props: {
    toggle: {
      default: false,
      type: Boolean
    }
  },
  data: function() {
    return {
    };
  },
  computed:{
    ...mapState({
      populationSquares: state => state.map.populationSquares,
    }),
    ...mapGetters(["selectedRegion", "selectedFire"])
  },
  methods: {
    convertSettingsToJson() {

        var outputTemplate = { 
            "ees": [ 
                { 
                "global" : [ 
                    { 
                            "randomSeed": "1234", 
                            "crs": "EPSG:28355", 
                            "startHHMM": "00:00" 
                    } 
                ], 
            
                "bdi" : [ 
                    { 
                            "jPlanSelectionPolicy": "FIRST", 
                            "jAgents": "", 
                            "jLogLevel": "WARN", 
                            "jLogFile": "test/output/io/github/agentsoz/ees/TypicalSummerWeekday50kTest/testTypicalSummerWeekday50k/jill.log", 
                            "jOutFile": "test/output/io/github/agentsoz/ees//TypicalSummerWeekday50kTest/testTypicalSummerWeekday50k/jill.out" 
                    } 
                ], 
            
                "matsim" : [ 
                    { 
                            "outputDir": "test/output/io/github/agentsoz/ees//TypicalSummerWeekday50kTest/testTypicalSummerWeekday50k/matsim", 
                            "configXml": "scenarios/surf-coast-shire/typical-summer-weekday-50k/scenario_matsim_main.xml", 
                            "maxDistanceForFireVisual": "1000", 
                            "maxDistanceForSmokeVisual": "5000", 
                            "fireAvoidanceBufferForVehicles": "5000", 
                            "fireAvoidanceBufferForEmergencyVehicles": "1000", 
                            "congestionEvaluationInterval": "180", 
                            "congestionToleranceThreshold": "0.33", 
                            "congestionReactionProbability": "0.0" 
                    } 
                ], 
            
                "phoenix" : [ 
                    { 
                            "ignitionHHMM": "00:00", 
                            "fireGeoJson": "scenarios/surf-coast-shire/typical-summer-weekday-50k/scenario_fire.json", 
                            "smokeGeoJson": "" 
                    } 
                ], 
            
                "disruption" : [ 
                    { 
                            "fileJson": "" 
                    } 
                ], 
            
                "messaging" : [ 
                    { 
                    } 
                ] 
            
                } 
            ], 
            "scenario_main": [ 
                { 
                "matsimfile" : "scenarios/surf-coast-shire/typical-summer-weekday-50k/scenario_matsim_main.xml", 
            
                "firefile" : [ 
                    { 
                            "name": "", 
                            "coordinates": "", 
                            "format": "" 
                    } 
                ], 
            
                "geographyfile" : [ 
                    { 
                            "geo_name": "scenarios/surf-coast-shire/typical-summer-weekday-50k/scenario_geography.xml" 
                    } 
                ], 
            
                "trafficBehaviour" : [ 
                    { 
                            "proportion": "0.0", 
                            "radiusInMtrs": "0" 
                    } 
                ], 
            
                "evacuationTiming" : [ 
                    { 
                            "start": "00:00", 
                            "peak": "00" 
                    } 
                ], 
            
                "bdiagents" : "bdiagents" 
            
                } 
            ] 
            }

        this.$store.commit(
        "setSavedSettingsJson",
        outputTemplate
        );

        //this.toggle = !this.toggle;
    }
  }
};
</script>

<style>
#save-map-settings {
  position: absolute;
  top: 10px;
  overflow: visible;
  margin: 0 0 0 -30px;
}
</style>