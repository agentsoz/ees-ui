# Emergency Evacuation Simulator - User Interface
A frontend for the EES application using Mapbox and the Vue.js framework.

MATSim road network links for each region are visualised using pbf tiles
hosted by a tiles server. Phoenix fires are expected to be in a geojson format,
with each feature having properties:

- `HOUR_BURNT` for time scrubbing
- `FLAME_HT` for flame height
- `FLAME_INTSTY` for colour of flame

The state of the application is held and manipulated mostly by a Vuex store.
The store is separated into modules for each functional aspect of the application `src/store/modules`.
The store modules are in the global scope so that multiple modules can respond
to a particular mutation or action call (e.g. action `clearMap`).

Components mostly call actions, which activate mutations in order to manipulate
MapBox and update the state.

## Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Run your tests
```
npm run test
```

#### Lints and fixes files
```
npm run lint
```

#### Run your end-to-end tests
```
npm run test:e2e
```

#### Run your unit tests
```
npm run test:unit
```

## MATSim Regions
The Mapbox UI relies on a tile server hosting the matsim network for that region.
The UI allows only one active MATSim region at a time.

#### Adding regions and fires
Region and fire data is stored in the Vuex store module `src/store/modules/config.js`:
```
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
            "fire_evac_grid",
          name: "Fire Evac Grid",
          description: "12:00 point fire ignition",
          geojson:
            process.env.VUE_APP_EES_TILES_API +
            "phoenix/evac_grid.json"
        }
      ]
    }
```

IMPORTANT: The `matsimNetworkLayer` attribute must match the filename of the original GeoJSON
file used in the tippecanoe conversion to mbtiles (e.g. `surf_coast_shire_networkP` refers to
`surf_coast_shire_networkP.json`).
