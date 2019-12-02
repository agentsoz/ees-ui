<template>
  <div v-if="isLoading !== 0" class="load-spinner-overlay">
    <div class="load-spinner-overlay-inner">
      <span class="loading"></span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "mapSpinner",
  props: {},
  computed: {
    ...mapState({
      isLoading: state => state.map.isLoading
    })
  }
};
</script>

<style>
.load-spinner-overlay {
  position: absolute;
  bottom: 100px;
  right: 30px;
  height: auto;
  overflow: visible;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  z-index: 100;
}

.load-spinner-overlay .load-spinner-overlay-inner {
  margin-bottom: 10px;
}
</style>
