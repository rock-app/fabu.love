<template>
  <div>
    <el-container class="main-container">
      <el-aside width="190px">
        <mainNav></mainNav>
      </el-aside>
      <el-container>
        <el-header class="main-header">
          <headerNav></headerNav>
        </el-header>
        <el-main class="main-contentWrapper">
          <router-view/>
          <footerWrapper></footerWrapper>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
  import MainNav from './mainNav.vue'
  import HeaderNav from './headerNav.vue'
  import FooterWrapper from './footerWrapper.vue'
  import AppList from '../appList/appList.vue'

  export default {
    data() {
      return {
      }
    },
    components: {
      MainNav, HeaderNav, FooterWrapper, AppList
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .main-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .main-container .el-aside {
    background-color: white;
    border-right: solid 1px #e6e6e6;
  }
  .main-header {
    background-color: white;
    margin-left: 2px;
    height: 72px !important;
    overflow: hidden;
  }
  .main-contentWrapper {
    padding: 0 24px;
  }
</style>
