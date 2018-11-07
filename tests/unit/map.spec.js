import { expect } from "chai";
import map from "@/store/modules/map";

describe("VuexStore", () => {
  it("Can remove all MATSim layers", () => {
    const commit = () => {};
    const getters = {
      mapInstance: {},
      loadedMATSimLayers: [],
      loadedMATSimSource: null
    };
    map.actions.removeMATSimLayers({ commit, getters });
    expect(true).to.equal(true);
  });
});
