
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

/* DO NOT LOAD THIS FILE */
//var agent_events = require("./agent_events.js").agent_events;
var agents_startingPos = require("./agents_startingPos.js").agents_startingPos;

var bounding_box = [[39.9058, -86.091], [39.8992, -86.1017]];
let bounding_points = [[-37.804647,144.939709], [-37.822701,144.982924]];

export default {
  data: function() {
    return {
      totalAgentsNum: 100,
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
      // get starting position of agent
      var agentKey = Object.keys(agents_startingPos)[this.getAgentIndex];

      var agent = agents_startingPos[agentKey];
      var agentStartingLat = agent[0];
      var agentStartingLong = agent[1];
      
      if(this.totalAgentsNum > this.getAgentIndex)
        this.getAgentIndex = this.getAgentIndex + 1;

        var layer = {
          "type": "Feature",
          "properties": {
            "place": {
              "type": "unit",
              "id": parseInt(agentKey)
            },
            "layer_options": {
              "id": agentKey,
              "radius": 0.5,
              "color": "red",
              "fillColor": "red"
            }
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              agentStartingLat,
              agentStartingLong
            ]
          }
        };

      return layer;
    },
    test() {
      let agentmap = L.A.agentmap(this.map);

      agentmap.agentify(this.totalAgentsNum, this.seqAgentMaker);
      
      fetch(process.env.VUE_APP_EES_TILES_API + "/agents-events")
      .then(response => response)
      .then(body => {
          if (body.details) {
              // there was an error...
              const error = body.details.map(detail => detail.message).join(". ");
              console.log(error);
          } else {
              body.json().then(chunk => {
                  var agent_events = JSON.parse(chunk);

                  var eventKeys = Object.keys(agent_events);
     
                  eventKeys.filter(function(event) {
                    agentmap.agents.eachLayer(function(agent) {
                            if(agent_events[event][agent.options.id] != null) {
                              var coords = agent_events[event][agent.options.id];
                              var lat_lng = L.latLng(coords[1][1], coords[1][0]);

                              agent.scheduleTrip(lat_lng, {type: "unanchored"}, 40);
                            }
                        });
                  });

              });
          }
      });

      agentmap.controller = function() {
        if (agentmap.state.ticks % 1 === 0) {
          agentmap.agents.eachLayer(function(agent) {
            agent.moveIt();
          });
        }
      };
      agentmap.run();
    }
  }
};
</script>


