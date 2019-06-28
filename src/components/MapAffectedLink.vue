<template>
  <div class="map-link-panel">
    <b-form-group label="MATSim Link ID:" label-for="map-link">
      <b-form-input
        id="map-link"
        type="text"
        v-model="linkId"
        placeholder="Please select a MATSim Network Link from the map"
        readonly
      >
      </b-form-input>
    </b-form-group>
    <b-form-group label="Disruption Start Time:" label-for="map-link-start">
      <b-form-input id="map-link-start" type="text" v-model="linkStart">
      </b-form-input>
    </b-form-group>
    <button class="icon" type="button" @click="toggle()">Save</button>
  </div>
</template>

<script>
export default {
  name: "mapAffectedLink",
  props: {
    linkId: {
      default: "",
      type: String
    },
    linkStart: {
      default: "00:00",
      type: String
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.map.affectedLinkIsOpen;
      },
      set(value) {
        this.$store.commit("setAffectedLinkIsOpen", value);
      }
    }
  },
  methods: {
    toggle: function() {
      this.$store.commit(
        "setAffectedLinkIsOpen",
        !this.$store.state.map.affectedLinkIsOpen
      );
    }
  }
};
</script>

<style>
.map-overlay {
  font: bold 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
  position: absolute;
  width: 40%;
  top: 10%;
  right: 30%;
  height: auto;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 0 0 20px 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 100;
}

.map-overlay label {
  display: block;
  margin: 10px 0 0 0;
}

.map-overlay input {
  display: inline-block;
  width: 100%;
  position: relative;
  margin: 0;
}
</style>
