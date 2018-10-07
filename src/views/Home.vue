<template>
  <div>
    <maplayer/>
    <settings/>
  </div>
</template>

<script>
import MapComponent from "@/components/Map.vue";
import MapSettings from "@/components/MapSettings.vue";

export default {
  name: "home",
  components: {
    maplayer: MapComponent,
    settings: MapSettings
  }
};
</script>
