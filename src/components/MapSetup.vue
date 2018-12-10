<template>
  <b-container fluid class="p-0 h-100 mapboxgl-ctrl-top-left map-sidebar-container">
    <b-row no-gutters class="h-100">
      <b-col lg="4" md="4" sm="12" class="h-100 m-0 mapboxgl-ctrl map-sidebar-col">
        <div id="nav">
          <h5>Emergency Evacuation Simulator</h5>
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </div>
        <div class="h-100 map-accordion-container">
          <b-card header="Map Style" no-body class="mb-1">
            <div class="p-1" role="tab">
              <div block href="#" v-b-toggle.map-style-accordion variant="info">
                {{ selectedStyle.name }}
                <div class="icon caret-down" style="float:right"></div>
              </div>
            </div>
            <b-collapse id="map-style-accordion" accordion="map-accordion" role="tabpanel">
              <ul>
                <li v-for="style in styles" :key="style.id" :disabled="selectedStyle.id==style.id">
                  <div
                    @click="setStyle"
                    :data-map-style="style.id"
                    v-if="selectedStyle.id!=style.id">
                    {{ style.name }}
                  </div>
                </li>
              </ul>
            </b-collapse>
          </b-card>
          <b-card header="Region" no-body class="mb-1">
            <div class="p-1" role="tab">
              <div block href="#" v-b-toggle.map-region-accordion variant="info">
                {{ selectedRegion ? selectedRegion.name : "Region" }}
                <div class="icon caret-down" style="float:right"></div>
              </div>
            </div>
            <b-collapse id="map-region-accordion" visible accordion="map-accordion" role="tabpanel">
              <ul>
                <li v-for="region in regions" :key="region.id" :disabled="selectedRegion && selectedRegion.id==region.id">
                  <div
                    @click="setRegion"
                    :data-region="region.id"
                    v-if="!selectedRegion || (selectedRegion && selectedRegion.id!=region.id)">
                    {{ region.name }}
                  </div>
                </li>
              </ul>
            </b-collapse>
          </b-card>
          <b-card header="Emergency Incident" no-body class="mb-1">
            <div class="p-1" role="tab">
              <div block href="#" v-b-toggle.map-fire-accordion variant="info">
                {{ selectedFire ? selectedFire.name : "Phoenix Fire" }}
                <div class="icon caret-down" style="float:right"></div>
              </div>
            </div>
            <b-collapse id="map-fire-accordion" accordion="map-accordion" role="tabpanel">
              <ul>
                <li v-for="fire in firesInSelectedRegion" :key="fire.id" :disabled="selectedFire && selectedFire.id==fire.id">
                  <div
                    @click="setFire"
                    :data-fire="fire.id"
                    v-if="!selectedFire || (selectedFire && selectedFire.id!=fire.id)">
                    {{ fire.name }}
                  </div>
                </li>
              </ul>
            </b-collapse>
          </b-card>
          <b-card header="Vehicle Configuration" no-body class="mb-1">
            <div class="p-1" role="tab">
              <div block href="#" v-b-toggle.map-vehicle-accordion variant="info">
                Vehicle Configuration
                <div class="icon caret-down" style="float:right"></div>
              </div>
            </div>
            <b-collapse id="map-vehicle-accordion" accordion="map-accordion" role="tabpanel">
              <ul>
                <li v-for="square in populationSquares" :key="square.id">
                  <div>
                    {{ square.id }}
                  </div>
                </li>
              </ul>
            </b-collapse>
            <div class="card-text">Test</div>
          </b-card>
          <b-card header="Impacted Links" no-body class="mb-1">
            <div class="p-1" role="tab">
              <div block href="#" v-b-toggle.map-link-accordion variant="info">
                Provisioned Links
                <div class="icon caret-down" style="float:right"></div>
              </div>
            </div>
            <b-collapse id="map-link-accordion" accordion="map-accordion" role="tabpanel">
              <ul>
                <li v-for="link in []" :key="link.id">
                  <div>
                    link
                  </div>
                </li>
              </ul>
            </b-collapse>
            <div class="p-1" role="tab">
              <div block href="#" v-b-toggle.add-map-link-accordion variant="info">
                Create New Link
                <a href="#" class="icon plus" style="float:right"></a>
              </div>
            </div>
            <b-collapse id="add-map-link-accordion" accordion="map-accordion" role="tabpanel">
              <mapAffectedLink :linkId=selectedMATSimLink />
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

export default {
  name: "mapSetup",
  props: {},
  data: function() {
    return {
      styles: this.$store.state.config.styles,
      regions: this.$store.state.config.regions
    };
  },
  computed: {
    ...mapState({
      populationSquares: state => state.map.populationSquares,
      selectedMATSimLink: state => state.map.selectedMATSimLink
    }),
    ...mapGetters(["selectedStyle", "selectedRegion", "selectedFire"]),
    isOpen: {
      get() {
        return this.$store.state.map.mapSettingsIsOpen;
      },
      set(value) {
        this.$store.commit("mapSettingsIsOpen", value);
      }
    },
    firesInSelectedRegion() {
      return !this.$store.getters.firesInSelectedRegion
        ? []
        : this.$store.getters.firesInSelectedRegion;
    }
  },
  components: {
    mapAffectedLink: MapAffectedLink
  },
  methods: {
    ...mapActions([
      "selectRegion",
      "changeMapboxStyle",
      "selectFire"
    ]),
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
</style>
