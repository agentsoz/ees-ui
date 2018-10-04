<template>
  <div class="about">
    <h1>Emergency Evacuation Simulator<br/>Web User Interface</h1>
    <h5>&copy; 2016&ndash;2018 RMIT University</h5>
    <div class="wrapper" id="logos">
      <b-img :src="rmit" fluid alt="RMIT University" />
      <b-img :src="telematics" fluid alt="Telematics Trust" />
      <b-img :src="masc" fluid alt="Mount Alexander Shire Council" />
      <b-img :src="vicpol" fluid alt="Victoria Police" />
      <b-img :src="ffmvic" fluid alt="Forest Fire Management Victoria" />
      <b-img :src="cfa" fluid alt="Country Fire Authority" />
      <b-img :src="cluster" fluid alt="Northern Victorian Emergency Management Cluster" />
      <b-img :src="tub" fluid alt="TU Berlin" />
      <b-img :src="matsim" fluid alt="MATSim" />
    </div>
  </div>
</template>

<script>
import rmit from "../assets/logo-rmit.png";
import telematics from "../assets/logo-telematics.png";
import masc from "../assets/logo-masc.png";
import vicpol from "../assets/logo-vicpol.png";
import ffmvic from "../assets/logo-ffmvic.png";
import cfa from "../assets/logo-cfa.png";
import cluster from "../assets/logo-northern-cluster.png";
import tub from "../assets/logo-tub.png";
import matsim from "../assets/logo-matsim.png";

export default {
  data: function() {
    return {
      rmit: rmit,
      telematics: telematics,
      masc: masc,
      vicpol: vicpol,
      ffmvic: ffmvic,
      cfa: cfa,
      cluster: cluster,
      tub: tub,
      matsim: matsim
    };
  }
};
</script>

<style>
.about {
  padding-top: 50px;
}
.img-fluid {
  flex: 100%;
  max-width: 20%;
  padding: 0 4px;
}
@media screen and (max-width: 800px) {
  .img-fluid {
    max-width: 50%;
  }
}
@media screen and (max-width: 600px) {
  .img-fluid {
    max-width: 100%;
  }
}

#logos {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 50px;
  height: auto;
}
</style>
