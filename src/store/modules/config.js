// Configuration for the application.
//
import { START_LOADING, DONE_LOADING } from "@/store/mutation-types";

const state = {
  mapboxAccessToken:
    "pk.eyJ1IjoiZGhpeHNpbmdoIiwiYSI6ImNqbWx4OTR0ZzBkMWUzb255and1aTUweGkifQ.U0vPiwyfM4ad7axC_4dkHg",
  error: null,
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
  },
  ["ERROR"](state, value) {
    state.error = value;
  }
};
const actions = {
  getConfig({ commit, getters }, url) {
    commit(START_LOADING);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        commit(DONE_LOADING);
        commit("SAVE_SETTINGS", json);

        // we should check whether the server actually returned fire and populations
        var empty = [];
        if (Object.keys(getters.populations).length == 0)
          empty.push("populations");
        if (Object.keys(getters.fires).length == 0) empty.push("fires");

        if (empty.length > 0)
          commit(
            "ERROR",
            "The server did not return any " +
              empty.join(" or ") +
              " for use." +
              "<br />" +
              "The server may currently be downloading resources. Please refresh " +
              "the page after about a minute."
          );
      })
      .catch(e => {
        commit(
          "ERROR",
          "Could not retreive anything from the server. Please try again later." +
            "<br />Tried URL: " +
            url +
            "<br />" +
            "<br /> Error message below.<br /><br />" +
            e
        );
        commit(DONE_LOADING);
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
