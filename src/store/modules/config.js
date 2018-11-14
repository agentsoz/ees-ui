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
          id: "20160420_MtAlexShire_FDI50_Iso",
          name: "20160420 Maldon FFDI50 ISO",
          description:
            "Forest Fire Danger Index (FFDI) 50 with south west wind change; based on 11:00 point fire ignition and running until 18:00",
          geojson:
            "https://raw.githubusercontent.com/agentsoz/ees/72222359e6418bf491b8176ab47586dcbd551bc5/scenarios/mount-alexander-shire/app-data/maldon/20160420_MtAlexShire_FDI50_Iso.json"
        },
        {
          id: "20160420_MtAlexShire_FDI75_Iso",
          name: "20160420 Maldon FFDI75 ISO",
          description:
            "Forest Fire Danger Index (FFDI) 75 with south west wind change; based on 11:00 point fire ignition and running until 18:00",
          geojson:
            "https://raw.githubusercontent.com/agentsoz/ees/72222359e6418bf491b8176ab47586dcbd551bc5/scenarios/mount-alexander-shire/app-data/maldon/20160420_MtAlexShire_FDI75_Iso.json"
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
            "https://raw.githubusercontent.com/agentsoz/ees/f25dd3427060180f08716c25198d5b6e0e530fd9/scenarios/surf-coast-shire/data/phoenix/Anglesea_evac_test_ffdi104_phx5_2016data_minsup_fh2017_grid_WSG84.json"
        }
      ]
    }
  ]
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

const mutations = {};
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
