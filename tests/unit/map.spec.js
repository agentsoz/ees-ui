import { expect } from "chai";
import map from "@/store/modules/map";

describe("store", () => {
  it("Remove all MATSim layers", () => {
    const commit = (type, payload) => {
      console.log(type);
      console.log(payload);
    };
    const getters = {
      mapInstance: {},
      loadedMATSimLayers: [],
      loadedMATSimSource: null
    };
    map.actions.removeMATSimLayers({ commit, getters });
    expect(true).to.equal(true);
  });
});
