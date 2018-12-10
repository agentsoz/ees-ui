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
