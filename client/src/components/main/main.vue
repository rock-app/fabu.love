<template>
  <div>
    <el-container class="main-container">
      <div class="side-menu" width="192px">
        <mainNav></mainNav>
      </div>
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

    <!--用户信息-->
    <userInfo v-if="this.showUserInfo"></userInfo>
  </div>
</template>

<script type="text/ecmascript-6">
  import MainNav from './mainNav.vue'
  import HeaderNav from './headerNav.vue'
  import FooterWrapper from './footerWrapper.vue'
  import AppList from '../appList/appList.vue'
  import UserInfo from '../user/userInfo.vue'
  import Bus from '../../common/js/bus'

  export default {
    data() {
      return {
        showUserInfo: false
      }
    },
    components: {
      MainNav, HeaderNav, FooterWrapper, AppList, UserInfo
    },
    created() {
      Bus.$on('showUserInfo', () => {
        this.showUserInfo = true
      })
      Bus.$on('hiddenUserInfo', () => {
        this.showUserInfo = false
      })
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
  .main-container .side-menu {
    background-color: white;
    border-right: solid 1px #e6e6e6;
  }
  .main-header {
    background-color: white;
    height: 72px !important;
  }
  .main-contentWrapper {
    padding: 0 24px;
  }
</style>
