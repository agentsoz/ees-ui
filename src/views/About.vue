<template>
  <div class="about">
    <h1>Emergency Evacuation Simulator</h1>
    <h5>&copy; 2016, 2017, 2018, RMIT University.</h5>
    <div id="logos">
      <b-img :src="collaborator1" fluid-grow alt="Collaborators" />
      <b-img :src="collaborator2" fluid-grow alt="Collaborators" />
    </div>
  </div>
</template>

<script>
import collaborator1 from "../assets/collaborator-logos-row1.png";
import collaborator2 from "../assets/collaborator-logos-row2.png";

export default {
  data: function() {
    return {
      collaborator1: collaborator1,
      collaborator2: collaborator2
    };
  }
};
</script>

<style>
.about {
  padding-top: 50px;
}
#logos {
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  padding: 50px;
  height: auto;
}
</style>
