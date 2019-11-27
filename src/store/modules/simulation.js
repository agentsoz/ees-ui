// simulation state
import {
  MATSIM_SAVE_CONFIG,
  MATSIM_SETTINGS_VIS
} from "@/store/mutation-types";

const state = {
  savedSettingsJson: null,
  simulationName: null,
  simSettingsIsOpen: false
};

const getters = {};

const mutations = {
  [MATSIM_SAVE_CONFIG](state, value) {
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
  [MATSIM_SETTINGS_VIS](state, value) {
    state.simSettingsIsOpen = value;
  },
  setSimulationName(state, value) {
    state.simulationName = value;
  }
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
