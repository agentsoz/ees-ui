<template>
  <b-container
    fluid
    class="p-0 h-100 mapboxgl-ctrl-top-left map-sidebar-container"
  >
    <b-row no-gutters class="h-100">
      <b-col
        lg="4"
        md="4"
        sm="12"
        class="h-100 m-0 mapboxgl-ctrl map-sidebar-col"
        :class="{ hidden: isHidden }"
      >
        <div id="nav">
          <h5>Emergency Evacuation Simulator</h5>
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
          <b-button
            style="position:absolute;bottom:2px;right:5px;"
            size="sm"
            variant="secondary"
            @click="toggle()"
            >Hide</b-button
          >
        </div>
        <div class="h-100 map-accordion-container">
          <b-card header="Map Style" no-body class="mb-1">
            <div class="p-1" role="tab">
              <div block href="#" v-b-toggle.map-style-accordion variant="info">
                {{ selectedStyle.name }}
                <div class="icon caret-down" style="float:right"></div>
              </div>
            </div>
            <b-collapse
              id="map-style-accordion"
              accordion="map-accordion"
              role="tabpanel"
            >
              <ul>
                <li
                  v-for="style in styles"
                  :key="style.id"
                  :disabled="selectedStyle.id == style.id"
                >
                  <div
                    @click="setStyle"
                    :data-map-style="style.id"
                    v-if="selectedStyle.id != style.id"
                  >
                    {{ style.name }}
                  </div>
                </li>
              </ul>
            </b-collapse>
          </b-card>

          <b-card header="Region" no-body class="mb-1">
            <div class="p-1" role="tab">
              <div
                block
                href="#"
                v-b-toggle.map-region-accordion
                variant="info"
              >
                {{ selectedRegion ? selectedRegion.name : "Region" }}
                <div class="icon caret-down" style="float:right"></div>
              </div>
            </div>
            <b-collapse
              id="map-region-accordion"
              visible
              accordion="map-accordion"
              role="tabpanel"
            >
              <ul>
                <li
                  v-for="region in regions"
                  :key="region.id"
                  :disabled="selectedRegion && selectedRegion.id == region.id"
                >
                  <div
                    @click="setRegion"
                    :data-region="region.id"
                    v-if="
                      !selectedRegion ||
                        (selectedRegion && selectedRegion.id != region.id)
                    "
                  >
                    {{ region.name }}
                  </div>
                </li>
              </ul>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header>
              Emergency Incident
              <span class="helper-icons"><font-awesome-icon icon="info-circle" /></span>
            </b-card-header>
            <div class="p-1" role="tab">
              <div block href="#" v-b-toggle.map-fire-accordion variant="info">
                {{ selectedFire ? selectedFire.name : "Phoenix Fire" }}
                <div class="icon caret-down" style="float:right"></div>
              </div>
            </div>
            <b-collapse
              id="map-fire-accordion"
              accordion="map-accordion"
              role="tabpanel"
            >
              <ul>
                <li
                  v-for="fire in firesInSelectedRegion"
                  :key="fire.id"
                  :disabled="selectedFire && selectedFire.id == fire.id"
                >
                  <div
                    @click="setFire"
                    :data-fire="fire.id"
                    v-if="
                      !selectedFire ||
                        (selectedFire && selectedFire.id != fire.id)
                    "
                  >
                    {{ fire.name }}
                  </div>
                </li>
              </ul>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header>
              Timing
              <span class="helper-icons"><font-awesome-icon icon="info-circle" /></span>
            </b-card-header>
            <div class="p-1" role="tab">
              <b-row>
                <b-col md="4" sm="4" xs="4">
                  <label>Evac start (24hr)</label>
                  <b-form-input v-model="text" placeholder="12:00"></b-form-input>
                </b-col>
                <b-col md="7" sm="7" xs="7">
                  <label>Evac peak (mins)</label>
                  <div>
                  <VueSlideBar
                    v-model="slider.value"
                    :data="slider.timer_data"
                    :range="slider.timer_range"
                    :labelStyles="{ color: '#4a4a4a', backgroundColor: '#4a4a4a' }"
                    :processStyle="{ backgroundColor: '#d8d8d8' }"
                    @callbackRange="callbackRange">
                    <template slot="tooltip" slot-scope="tooltip">
                      <font-awesome-icon icon="map-marker" />
                    </template>
                  </VueSlideBar>
                </div>
                </b-col>
              </b-row>
            </div>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header>
              Destinations and safe lines
              <span class="helper-icons"><font-awesome-icon icon="info-circle" /></span>
            </b-card-header>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header>Traffic Behaviour Setup</b-card-header>
            <label>
              Maximum speed on roads (as % of speed limits)
              <span class="helper-icons"><font-awesome-icon icon="info-circle" /></span>
            </label>
            <VueSlideBar
              v-model="slider.value"
              :data="slider.traffic_data"
              :range="slider.traffic_range"
              :labelStyles="{ color: '#4a4a4a', backgroundColor: '#4a4a4a' }"
              :processStyle="{ backgroundColor: '#d8d8d8' }"
              @callbackRange="callbackRange">
              <template slot="tooltip" slot-scope="tooltip">
                <font-awesome-icon icon="map-marker" />
              </template>
            </VueSlideBar>
          </b-card>

          <b-card header="Impacted Links" no-body class="mb-1">
            <div class="p-1" role="tab">
              <div block href="#" v-b-toggle.map-link-accordion variant="info">
                Provisioned Links
                <div class="icon caret-down" style="float:right"></div>
              </div>
            </div>
            <b-collapse
              id="map-link-accordion"
              accordion="map-accordion"
              role="tabpanel"
            >
              <ul>
                <li v-for="link in []" :key="link.id">
                  <div>
                    link
                  </div>
                </li>
              </ul>
            </b-collapse>
            <div class="p-1" role="tab">
              <div
                block
                href="#"
                v-b-toggle.add-map-link-accordion
                variant="info"
              >
                Create New Link
                <a href="#" class="icon plus" style="float:right"></a>
              </div>
            </div>
            <b-collapse
              id="add-map-link-accordion"
              accordion="map-accordion"
              role="tabpanel"
            >
              <mapAffectedLink :linkId="selectedMATSimLink" />
            </b-collapse>
          </b-card>

        </div>
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
import { faMapMarker, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faMapMarker, faInfoCircle);
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
      rangeValue: {},
      slider: {
        value: 0,
        traffic_data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        traffic_range: [
          {
            label: "|",
            isHide: true
          },
          {
            label: "20%"
          },
          {
            label: "|",
            isHide: true
          },
          {
            label: "40%"
          },
          {
            label: "|",
            isHide: true
          },
          {
            label: "60%"
          },
          {
            label: "|",
            isHide: true
          },
          {
            label: "80%"
          },
          {
            label: "|",
            isHide: true
          },
          {
            label: "100%"
          },
        ],
        timer_data: [0, 30, 60, 90, 120, 150, 180],
        timer_range: [
          {
            label: "0"
          },
          {
            label: "|",
            isHide: true
          },
          {
            label: "60"
          },
          {
            label: "|",
            isHide: true
          },
          {
            label: "120"
          },
          {
            label: "|",
            isHide: true
          },
          {
            label: "180"
          }
        ]
      }
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
  padding: 80px 20px;
}

.map-sidebar-container .map-sidebar-col {
  background-color: rgba(255, 255, 255, 0.8);
  overflow-y: auto;
}

.helper-icons{
  position:relative;
  left: 5px;
}
</style>
