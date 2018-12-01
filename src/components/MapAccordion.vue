<template>
  <b-container fluid class="p-0 h-100 mapboxgl-ctrl-top-left map-sidebar-container">
    <b-row no-gutters class="mh-100">
      <b-col lg="2" md="4" sm="12" class="m-0 mapboxgl-ctrl map-sidebar-col">
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </div>
        <div class="map-accordion-container">
          <b-card no-body class="mb-1">
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
          <b-card no-body class="mb-1">
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
          <b-card no-body class="mb-1">
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
          <b-card no-body class="mb-1">
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
          </b-card>
          <b-card no-body class="mb-1">
            <div class="p-1" role="tab">
              <div block href="#" v-b-toggle.map-link-accordion variant="info">
                Impacted Links
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
          </b-card>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "mapSettings",
  props: {},
  data: function() {
    return {
      styles: this.$store.state.config.styles,
      regions: this.$store.state.config.regions
    };
  },
  computed: {
    ...mapState({
      populationSquares: state => state.map.populationSquares
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
    },
    renderFireIn3D: {
      get() {
        return this.$store.state.fire.fire3DFlameHeight;
      },
      set(value) {
        this.$store.commit("setFire3DFlameHeight", value);
        this.$store.dispatch("resetFireLayers");
      }
    }
  },
  methods: {
    ...mapActions(["selectRegion", "toggleFireIn3D", "changeMapboxStyle"]),
    setStyle: function(event) {
      this.changeMapboxStyle(event.target.dataset.mapStyle);
    },
    setRegion: function(event) {
      // set the selected region in state
      this.selectRegion(event.target.dataset.region);
    },
    setFire: function(event) {
      this.$store.commit("setSelectedFire", event.target.dataset.fire);
      var fireData = this.$store.getters.selectedFire;
      this.$store.dispatch("fetchFire", !fireData ? "" : fireData.geojson);
    },
    drawRectangle() {
      this.$store.commit("drawPopulationSquare");
    }
  }
};
</script>

<style>
.map-sidebar-container {
}
.map-accordion-container {
  background-color: rgba(255, 255, 255, 0.8);
  text-align: left;
  padding: 20px;
}

.map-sidebar-container .map-sidebar-col {
  overflow-y: auto;
}
</style>
