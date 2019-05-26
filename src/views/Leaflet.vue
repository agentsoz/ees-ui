
<template lang="html">
 <div v-on:click="test()">
   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"/>
  <div class="row">
    <div id="map">
    </div>
  </div>
  </div>
</template>
<script type="text/javascript" src="./map_data.js"></script>
<script>

import L from "leaflet";
import A from "agentmaps";
import proj4L from "proj4leaflet";
import proj4 from "proj4";

var map_data = require("./map_data.js").map_data;
var test_data = require("./test_data.js").test_data;
var events_data = require("./events_data.js").events_data;
var bounding_box = [[39.9058, -86.091], [39.8992, -86.1017]];
let bounding_points = [[-37.804647,144.939709], [-37.822701,144.982924]];

export default {
  data: function() {
    return {
      totalAgentsNum: 3,
      agentIndex: 0
    }
  },
  mounted() {
    //Creates map
    this.map = L.map("map").fitBounds(bounding_points);
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Thanks to <a href="http://openstreetmap.org">OpenStreetMap</a> community'
    }).addTo(this.map);
  },
  computed: {
    getAgentIndex: {
      get(){
        return this.agentIndex;
      },
      set(value) {
        this.agentIndex = value;
      }
    }
  },
  methods: {
    seqAgentMaker: function() {
      var agent = test_data[this.getAgentIndex];
      
      if(this.totalAgentsNum > this.getAgentIndex)
        this.getAgentIndex = this.getAgentIndex + 1;

      return agent;
    },
    test() {
      var firstProjection = 'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';
      var secondProjection = "+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

      var inputProj = proj4('+proj=utm +zone=55 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
      var outputProj = proj4('EPSG:4326');

      //Taken from demo tutorial
      let agentmap = L.A.agentmap(this.map);
      // no need to for units
      //agentmap.buildingify(bounding_points, map_data);

      agentmap.agentify(this.totalAgentsNum, this.seqAgentMaker);
      
      agentmap.controller = function() {
        if (agentmap.state.ticks % 10 === 0) {
          agentmap.agents.eachLayer(function(agent) {
            var random_lat_lng = L.latLng(-37.814647, 144.929708);

            agent.scheduleTrip(random_lat_lng, {type: "unanchored"}, 1);

            agent.moveIt();
          });
        }
      };
      agentmap.run();
    }
  }
};
</script>


