<template>
  <div v-if="popSelected != null" class="legend-overlay">
    <div class="legend-overlay-inner">
      <table id="pop-legend" cellspacing="3px">
        <tr v-for="(color, id) in activityColors" :key="id">
          <td :style="{ backgroundColor: color }">&nbsp;</td>
          <td class="p-2">{{ id }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "mapPopLegend",
  props: {},
  data: function() {
    return {};
  },
  computed: {
    ...mapState({
      activityColors: state => state.population.activityColors
    }),
    ...mapGetters({
      popSelected: "population/selected"
    })
  },
  methods: {}
};
</script>

<style>
.legend-overlay {
  position: absolute;
  width: 6%;
  bottom: 200px;
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
