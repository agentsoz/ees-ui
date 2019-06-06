
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

var agents_startingPos = require("./agents_startingPos.js").agents_startingPos;

var bounding_box = [[39.9058, -86.091], [39.8992, -86.1017]];
let bounding_points = [[-38.107783, 143.081728], [-38.763955, 144.534146]];

export default {
  data: function() {
    return {
      totalAgentsNum: 499,
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
      var i = 1;

      setInterval(function() {
        var eventGroup = {eventGroup: "agents_events_" + i};
        i++;
        fetch(process.env.VUE_APP_EES_TILES_API + "/agents-events", {
          method: "POST",
          body: JSON.stringify(eventGroup),
          headers: {
            "content-type": "application/json"
          }
        })
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

                                agent.scheduleTrip(lat_lng, {type: "unanchored"}, 80);
                              }
                          });
                    });
                });
            }
        });
      }, 1000);

      agentmap.controller = function() {
        if (this.animation_interval != 10)
          this.setAnimationInterval(10);
      };

      agentmap.agents.eachLayer(function(agent) {
        //Define what the agent will do on each tick.
        agent.controller = function() {
          agent.moveIt();
        };
      });

      agentmap.run();
    }
  }
};
</script>


