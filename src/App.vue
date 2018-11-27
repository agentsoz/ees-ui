<template>
  <div id="app">
    <router-view class="router-view"/>
  </div>
</template>

<style lang="scss">
html,
body {
  height: 100%;
}
.router-view {
  height: 100%;
}
#nav {
  height: 20px;
  background-color: #eee;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
