<template>
  <div class="map-settings-container">
    <div class='map-settings-button-container mapboxgl-ctrl-top-right'>
      <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button class="icon sprocket" type="button"></button>
      </div>
    </div>
    <div class='map-overlay'>
    <div class='map-settings-panel'>
        <!--
        <select v-model="selected">
          <option disabled value="">Please select one</option>
          <option>basic</option>
          <option>bright</option>
          <option>dark</option>
          <option>light</option>
          <option>satellite</option>
          <option>streets</option>
        </select>
      -->
    </div>
    </div>
</div>
</template>

<script>
export default {
  name: "mapSettings",
  props: {}
};
</script>


<style>
.map-settings-button-container {
  padding-top: 150px;
}

.map-settings-panel {
}

.map-overlay {
  font: bold 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
  position: absolute;
  width: 60%;
  top: 10%;
  right: 20%;
  height: 80%;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 100;
}

.map-overlay .map-overlay-inner {
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
}

.map-overlay label {
  display: block;
  margin: 0 0 10px;
}

.map-overlay input {
  background-color: transparent;
  display: inline-block;
  width: 100%;
  position: relative;
  margin: 0;
  cursor: ew-resize;
}
</style>
