
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

var map_data = require("./map_data.js").map_data;
var bounding_box = [[39.9058, -86.091], [39.8992, -86.1017]];
let bounding_points = [[39.9058, -86.091], [39.8992, -86.1017]];

export default {
  mounted() {
    //Creates map
    this.map = L.map("map").fitBounds(bounding_points);
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Thanks to <a href="http://openstreetmap.org">OpenStreetMap</a> community'
    }).addTo(this.map);
  },
  methods: {
    test() {
      //Taken from demo tutorial
      let agentmap = L.A.agentmap(this.map);
      agentmap.buildingify(bounding_points, map_data);
      agentmap.agentify(50, agentmap.seqUnitAgentMaker);
      agentmap.controller = function() {
        if (agentmap.state.ticks % 300 === 0) {
          agentmap.agents.eachLayer(function(agent) {
            let random_index = Math.floor(
                agentmap.units.count() * Math.random()
              ),
              random_unit = agentmap.units.getLayers()[random_index],
              random_unit_id = agentmap.units.getLayerId(random_unit),
              random_unit_center = random_unit.getBounds().getCenter();

            agent.scheduleTrip(
              random_unit_center,
              { type: "unit", id: random_unit_id },
              1,
              false,
              true
            );
          });
        }

        agent.moveIt();
      };
      agentmap.run();
    }
  }
};
</script>


