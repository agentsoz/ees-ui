// Configuration for the application.
//

const state = {
  mapboxAccessToken:
    "pk.eyJ1IjoiZGhpeHNpbmdoIiwiYSI6ImNqbWx4OTR0ZzBkMWUzb255and1aTUweGkifQ.U0vPiwyfM4ad7axC_4dkHg",
  styles: [
    {
      id: "basic",
      name: "Basic"
    },
    {
      id: "bright",
      name: "Bright"
    },
    {
      id: "dark",
      name: "Dark"
    },
    {
      id: "light",
      name: "Light"
    },
    {
      id: "satellite",
      name: "Satellite"
    },
    {
      id: "streets",
      name: "Streets"
    }
  ],
  regions: [
    {
      id: "Mount_Alexander_Shire",
      name: "Mount Alexander Shire",
      center: [144.212304, -37.064737], // Castlemaine VIC
      matsimNetworkLayer: "mount_alexander_shire_networkP",
      matsimNetworkTiles:
        process.env.VUE_APP_EES_TILES_API +
        "/matsim-tiles/mount-alexander-shire/{z}/{x}/{y}.pbf",
      phoenixRuns: [
        {
          id: "20181109_mountalex_evac_ffdi50a_grid",
          name: "20181109 Mountalex evac FFDI50a",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi50a_grid.shp.json"
        },
        {
          id: "20181109_mountalex_evac_ffdi50b_grid",
          name: "20181109 Mountalex evac FFDI50b",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi50b_grid.shp.json"
        },
        {
          id: "20181109_mountalex_evac_ffdi50c_grid",
          name: "20181109 Mountalex evac FFDI50c",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi50c_grid.shp.json"
        },
        {
          id: "20181109_mountalex_evac_ffdi50d_grid",
          name: "20181109 Mountalex evac FFDI50d",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi50d_grid.shp.json"
        },
        {
          id: "20181109_mountalex_evac_ffdi75a_grid",
          name: "20181109 Mountalex evac FFDI75a",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi75a_grid.shp.json"
        },
        {
          id: "20181109_mountalex_evac_ffdi75b_grid",
          name: "20181109 Mountalex evac FFDI75b",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi75b_grid.shp.json"
        },
        {
          id: "20181109_mountalex_evac_ffdi75c_grid",
          name: "20181109 Mountalex evac FFDI75c",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi75c_grid.shp.json"
        },
        {
          id: "20181109_mountalex_evac_ffdi75d_grid",
          name: "20181109 Mountalex evac FFDI75d",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi75d_grid.shp.json"
        },
        {
          id: "20181109_mountalex_evac_ffdi100b_grid",
          name: "20181109 Mountalex evac FFDI100b",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi100b_grid.shp.json"
        },
        {
          id: "20181109_mountalex_evac_ffdi100c_grid",
          name: "20181109 Mountalex evac FFDI100c",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi100c_grid.shp.json"
        },
        {
          id: "20181109_mountalex_evac_ffdi100d_grid",
          name: "20181109 Mountalex evac FFDI100d",
          description: "",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "/phoenix/20181109_mountalex_evac_ffdi100d_grid.shp.json"
        }
      ]
    },
    {
      id: "Surf_Coast_Shire",
      name: "Surf Coast Shire",
      center: [144.326271, -38.332386], // Torquay Esplanade
      matsimNetworkLayer: "surf_coast_shire_networkP",
      matsimNetworkTiles:
        process.env.VUE_APP_EES_TILES_API +
        "/matsim-tiles/surf-coast-shire/{z}/{x}/{y}.pbf",
      phoenixRuns: [
        {
          id:
            "Anglesea_evac_test_ffdi104_phx5_2016data_minsup_fh2017_grid_WSG84",
          name: "Anglesea_FFDI104 PHX5 2016 MINSUP FH2017 GRID",
          description: "12:00 point fire ignition",
          geojson:
            "https://raw.githubusercontent.com/agentsoz/ees/f25dd3427060180f08716c25198d5b6e0e530fd9/scenarios/surf-coast-shire/data/phoenix/Anglesea_evac_test_ffdi104_phx5_2016data_minsup_fh2017_grid_WSG84.json",
            smokeGeojson: "https://raw.githubusercontent.com/agentsoz/ees/master/scenarios/surf-coast-shire/population-subgroups/scenario_smoke.json"
        }
      ]
    }
  ],
  savedSettingsJson: null,
  simulationName: null,
  saveSimIsOpen: false
};

const getters = {
  mapboxAccessToken: state => state.mapboxAccessToken,
  styles: state => state.styles,
  regions: state => state.regions,
  region: state => regionId => {
    return state.regions.find(region => region.id === regionId);
  },
  firesInRegion: (state, getters) => regionId => {
    var regionX = getters.region(regionId);
    return regionX.phoenixRuns;
  }
};

const mutations = {
  setSavedSettingsJson(state, value) {
    state.savedSettingsJson = value;

    fetch(process.env.VUE_APP_EES_TILES_API + "/save-settings", {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(response => response)
      .then(result => {
        if (result.details) {
          // there was an error...
          const error = result.details.map(detail => detail.message).join(". ");
          console.log(error);
        } else {
          console.log(result);
        }
      });
  },
  setSimulationName(state, value) {
    state.simulationName = value;
  },
  setSaveSimIsOpen(state, value) {
    state.saveSimIsOpen = value;
  }
};
const actions = {
  createSimulation() {
    fetch(process.env.VUE_APP_EES_TILES_API + "/create-simulation", {
    }).then(response => response)
      .then(result => {
        if (result.details) {
          // there was an error...
          const error = result.details.map(detail => detail.message).join(". ");
          console.log(error);
        } else {
          console.log(result);
        }
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
