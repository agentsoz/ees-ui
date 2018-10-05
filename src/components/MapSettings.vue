<template>
  <div class='map-overlay top'>
    <div class='map-overlay-inner'>
      <select v-model="selected">
        <option disabled value="">Please select one</option>
        <option>basic</option>
        <option>bright</option>
        <option>dark</option>
        <option>light</option>
        <option>satellite</option>
        <option>streets</option>
      </select>
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
.map-overlay {
    font:bold 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
    position: absolute;
    width: 15%;
    bottom: 0%;
    right: 0%;
    padding: 10px;
    z-index: 100;
}

.map-overlay .map-overlay-inner {
    background-color: #fff;
    box-shadow:0 1px 2px rgba(0, 0, 0, 0.20);
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
