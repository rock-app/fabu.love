<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {getUserInfo} from './mgr/userMgr'

  export default {
    name: 'App',
    data() {
      return {
        isLogined: false
      }
    },
    created() {
      this.$nextTick(() => {
        let user = getUserInfo()
        if (user) {
          // 防止新打开的窗口也push到列表页
          if (window.location.href === (window.location.origin + '/')) {
            this.$router.push('/')
          }
        } else {
          this.$router.push('/login')
        }
      })
    },
    components: {
    },
    methods: {
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
