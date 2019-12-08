// Configuration for the application.
//

const state = {
  mapboxAccessToken:
    "pk.eyJ1IjoiZGhpeHNpbmdoIiwiYSI6ImNqbWx4OTR0ZzBkMWUzb255and1aTUweGkifQ.U0vPiwyfM4ad7axC_4dkHg",
  data: null,
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
  ]
};

const getters = {
  mapboxAccessToken: state => state.mapboxAccessToken,
  styles: state => state.styles,
  regions: state => {
    if (state.data) {
      return state.data.tiles;
    } else {
      return {};
    }
  },
  populations: state => {
    if (state.data) {
      return state.data.populations;
    } else {
      return {};
    }
  },
  fires: state => {
    if (state.data) {
      return state.data.fires;
    } else {
      return {};
    }
  },
  region: state => regionId => {
    return state.data.tiles[regionId];
  },
  populationsWithTag: (state, getters) => tag => {
    const populations = getters.populations;
    var filteredPops = {};
    for (const p in populations) {
      if (
        Array.isArray(populations[p].tags) &&
        populations[p].tags.includes(tag)
      ) {
        filteredPops[p] = populations[p];
      }
    }
    return filteredPops;
  },
  firesWithTag: (state, getters) => tag => {
    const fires = getters.fires;
    var filteredFires = {};
    for (const f in fires) {
      if (Array.isArray(fires[f].tags) && fires[f].tags.includes(tag)) {
        filteredFires[f] = fires[f];
      }
    }
    return filteredFires;
  }
};

const mutations = {
  ["SAVE_SETTINGS"](state, value) {
    state.data = value;
  }
};
const actions = {
  getConfig({ commit }, url) {
    fetch(url)
      .then(res => res.json())
      .then(json => {
        commit("SAVE_SETTINGS", json);
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
