jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
   Map: () => ({})
}));

import { expect } from "chai";
import mapboxgl from "mapbox-gl";
import map from "@/store/modules/map";

// helper for testing action with expected mutations
const testAction = (
  action,
  payload,
  getters,
  expectedDispatch,
  expectedMutations,
  done
) => {
  let dispatchCount = 0;
  let mutationCount = 0;
  let total = expectedDispatch.length + expectedMutations.length;

  const dispatch = (type, payload) => {
    const dispatchAction = expectedDispatch[dispatchCount];
    if (dispatchCount >= expectedDispatch.length) {
      done("More actions were called than we expected for this unit.");
      return;
    }

    try {
      expect(type).to.equal(dispatchAction.type);
      if (payload) {
        expect(payload).to.deep.equal(dispatchAction.payload);
      }
    } catch (error) {
      done(error);
    }

    dispatchCount++;
    if (dispatchCount + mutationCount >= total) {
      done();
    }
  };

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[mutationCount];
    if (mutationCount >= expectedMutations.length)
      done("More mutations were called than we expected for this unit.");

    try {
      expect(type).to.equal(mutation.type);
      if (payload) {
        expect(payload).to.deep.equal(mutation.payload);
      }
    } catch (error) {
      done(error);
    }

    mutationCount++;
    if (dispatchCount + mutationCount >= total) {
      done();
    }
  };

  // call the action with mocked store and arguments
  action({ dispatch, commit, getters }, payload);

  // check if no mutations should have been dispatched
  if (total === 0) {
    expect(dispatchCount + mutationCount).to.equal(0);
    done();
  }
};

/**
 * These tests ensure that no longer selected region/fire data is left behind when
 * changing styles or changing the selected region
 */
describe("High level calls to cleanup region & fire mutations", () => {
  it("loadMATSimRegion", done => {
    testAction(
      map.actions.loadMATSimRegion,
      null,
      {},
      [{ type: "loadLayers" }],
      [{ type: "clearFire" }, { type: "clearMATSimLayers" }],
      done
    );
  });
  it("resetAndSetStyle", done => {
    testAction(
      map.actions.resetAndMapboxStyle,
      null,
      {},
      [],
      [
        { type: "clearFire" },
        { type: "clearMATSimLayers" },
        { type: "setMapboxStyle" }
      ],
      done
    );
  });
});

/**
 * These tests attempt to describe the process when selecting a region
 */
describe("Actions & mutations responsible for Region selection", () => {
  const getters = {
    selectedRegion: {
      matsimNetworkTiles: "tiles",
      matsimNetworkLayer: "layer"
    }
  };
  const state = {
    mapInstance: {
      addSource: () => {}
    },
    loadedMATSimLayers: [],
    loadedMATSimSource: null
  };
  const matsimNetwork = {
    sourceName: "matsim",
    pbfurl: getters.selectedRegion.matsimNetworkTiles,
    layerName: getters.selectedRegion.matsimNetworkLayer,
    sourceLayer: getters.selectedRegion.matsimNetworkLayer,
    paint: {
      "line-color": "#7777ff",
      "line-width": 0.5
    },
    filter: ["all"]
  };
  var matsimNetworkHighlighted = JSON.parse(JSON.stringify(matsimNetwork));
  matsimNetworkHighlighted = Object.assign(matsimNetworkHighlighted, {
    layerName: matsimNetwork.layerName + "-highlighted",
    paint: {
      "line-color": "#FF8C00",
      "line-width": 1.5
    },
    filter: ["in", "ID", ""]
  });

  it("loadLayers provisions a matsimNetwork object and dispatches correctly", done => {
    testAction(
      map.actions.loadLayers,
      null,
      getters,
      [{ type: "loadMATSimNetwork", payload: matsimNetwork }],
      [],
      done
    );
  });

  // fetch not supported in this test, will need to be mocked
  it.skip("loadMATSimNetwork triggers mutations responsible for the network source, base layer and layer for hilighting", done => {
    testAction(
      map.actions.loadMATSimNetwork,
      matsimNetwork,
      {},
      [],
      [
        { type: "startLoading" },
        { type: "doneLoading" },
        { type: "loadMATSimSource", payload: matsimNetwork },
        { type: "addMATSimLayer", payload: matsimNetwork },
        { type: "setBaseMATSimLayer", payload: matsimNetwork.layerName },
        { type: "addMATSimLayer", payload: matsimNetworkHighlighted },
        {
          type: "setHighlightMATSimLayer",
          payload: matsimNetworkHighlighted.layerName
        }
      ],
      done
    );
  });
  it("loadMATSimSource asserts the network source in the store", () => {
    map.mutations.loadMATSimSource(state, matsimNetwork);
    expect(state.loadedMATSimSource).to.equal(matsimNetwork.sourceName);
  });
});
