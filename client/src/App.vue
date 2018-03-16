<template>
  <div id="app">
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
//        this.axios.defaults.baseURL = 'http://localhost:3001/'
//        this.axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
      }
    }
  }
</script>

<style lang="scss">
  @import "common/scss/reset";
  @import "common/scss/element";
  @import 'common/scss/icon.css';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  body {
    background-color: white;
  }
</style>
