
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
import proj4 from "proj4leaflet";

var map_data = require("./map_data.js").map_data;
var test_data = require("./test_data.js").test_data;
var bounding_box = [[39.9058, -86.091], [39.8992, -86.1017]];
let bounding_points = [[39.9058, -86.091], [39.8992, -86.1017]];

export default {
  data: function() {
    return {
      totalAgentsNum: 50,
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
    },
    seqAgentMaker: function() {
      var agent = test_data[this.getAgentIndex];
      
      if(this.totalAgentsNum > this.getAgentIndex)
        this.getAgentIndex = this.getAgentIndex + 1;

      return agent;
    }
  },
  methods: {
    test() {
      //Taken from demo tutorial
      let agentmap = L.A.agentmap(this.map);
      agentmap.buildingify(bounding_points, map_data);
      agentmap.agentify(this.totalAgentsNum, agentmap.seqUnitAgentMaker);
      agentmap.controller = function() {
        if (agentmap.state.ticks % 2 === 0) {
          agentmap.agents.eachLayer(function(agent) {
            let random_index = Math.floor(
                agentmap.units.count() * Math.random()
              ),
              random_unit = agentmap.units.getLayers()[random_index],
              random_unit_id = agentmap.units.getLayerId(random_unit),
              random_unit_center = random_unit.getBounds().getCenter();

            // Agents do not move when this is not commented out
            // agent.scheduleTrip(
            //   random_unit_center,
            //   { type: "unit", id: random_unit_id },
            //   1, false, true);

            // Find and move to a random, unanchored point in the neighborhood.
            var random_lat = bounding_box[0][0] + Math.random() * -(bounding_box[0][0] - bounding_box[1][0]),
            random_lng = bounding_box[0][1] + Math.random() * -(bounding_box[0][1] - bounding_box[1][1]),
            random_lat_lng = L.latLng(random_lat, random_lng);

            agent.scheduleTrip(random_lat_lng, {type: "unanchored"}, 1);
            
            // Find and move to a random street's intersection.
            var random_street_index = Math.floor(Math.random() * agentmap.streets.count()),
            random_street = agentmap.streets.getLayers()[random_street_index],
            street_id = agentmap.streets.getLayerId(random_street),
            cross_streets = Object.keys(random_street.intersections),
            intersection = random_street.intersections[cross_streets[0]][0][0];

            agent.scheduleTrip(intersection, {type: "street", id: street_id}, 2);
            
            // Find and move to a random unit door on the same street...
            var street_units = agentmap.units.getLayers().filter(function(unit) {
              return unit.street_id === street_id ? true : false;
            });

            //...Only if there are any units on the street.
          if (street_units.length > 0) {
            var new_random_unit_index = Math.floor(Math.random() * street_units.length),
            new_random_unit = street_units[new_random_unit_index],
            new_unit_id = new_random_unit._leaflet_id,
            new_unit_door = agentmap.getUnitDoor(new_unit_id);

            agent.scheduleTrip(new_unit_door, {type: "unit", id: new_unit_id}, .5);
            
            //Also, move to the door of one of that unit's nextdoor neighbors, if it has any.
            var neighbor_id = new_random_unit.neighbors[0] || new_random_unit.neighbors[1] || -1;
            if (neighbor_id !== -1) {
              var neighbor_unit_door = agentmap.getUnitDoor(neighbor_id);
              
              agent.scheduleTrip(neighbor_unit_door, {type: "unit", id: neighbor_id}, .4);
            }
          }

            agent.moveIt();
          });
        }
      };
      agentmap.run();
    }
  }
};
</script>


