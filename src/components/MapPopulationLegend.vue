<template>
  <div v-if="popSelected !== null" class="legend-overlay">
    <div class="legend-overlay-inner">
      <table id="pop-legend" cellspacing="3px">
        <tr v-for="(color, id, index) in currActivities" :key="id">
          <td>
            <verte
              class="p-1"
              menuPosition="top"
              picker="square"
              model="hex"
              :value="color"
              v-on:input="changeColor(index, $event)"
            ></verte>
          </td>
          <td class="p-2">{{ id }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Verte from "verte";
import "verte/dist/verte.css";
import { mapGetters } from "vuex";

export default {
  name: "mapPopLegend",
  props: {},
  data: function() {
    return {};
  },
  components: { Verte },
  computed: {
    ...mapGetters({
      popSelected: "population/selected",
      currActivities: "population/currActivities"
    })
  },
  methods: {
    changeColor: function(id, color) {
      this.$store.dispatch("population/changeActivityColor", { id, color });
    }
  }
};
</script>

<style>
.legend-overlay {
  position: absolute;
  width: 6%;
  bottom: 150px;
  right: 0;
  height: auto;
  overflow: visible;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  z-index: 100;
}

.legend-overlay .legend-overlay-inner {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  padding: 0;
  overflow: visible;
}
.legend-overlay-inner table td {
  text-transform: capitalize;
}
</style>
