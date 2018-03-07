<template>
  <div id="app">
    <!--<div class="bgview"></div>-->
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
      this._initHttp()
    },
    methods: {
      _initHttp() {
        this.axios.defaults.baseURL = 'http://localhost:3001/'
        this.axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
      }
    }
  }
</script>

<style lang="scss">
  @import "common/scss/reset";
  @import "common/scss/element";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  body {
    background-color: white;
  }
  .bgview {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    bottom: 0px;
    background-image: url("./assets/background.png");
    background-size: cover;
    z-index: -1;
    -webkit-animation: STAR-MOVE 200s linear infinite;
    -moz-animation: STAR-MOVE 200s linear infinite;
    -ms-animation: STAR-MOVE 200s linear infinite;
    animation: STAR-MOVE 200s linear infinite;
  }
  @-webkit-keyframes STAR-MOVE {
    from {
      background-position:0% 0%
    }
    to {
      background-position: 600% 0%
    }
  }
  @keyframes STAR-MOVE {
    from {
      background-position: 0% 0%
    }
    to {
      background-position: 600% 0%
    }
  }
</style>
