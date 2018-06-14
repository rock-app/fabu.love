<template>
  <div class="main">
    <el-container class="main-container">
      <el-aside class="side-menu" width="192px">
        <mainNav></mainNav>
      </el-aside>
      <el-container>
        <el-header class="main-header">
          <headerNav></headerNav>
        </el-header>
        <el-main class="main-contentWrapper">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <!--用户信息-->
    <userInfo v-if="this.showUserInfo"></userInfo>
    <!--消息列表-->
    <userMessage v-if="this.showUserMessage"></userMessage>
  </div>
</template>

<script type="text/ecmascript-6">
  import MainNav from './mainNav.vue'
  import HeaderNav from './headerNav.vue'
  import FooterWrapper from './footerWrapper.vue'
  import UserInfo from '../user/userInfo.vue'
  import UserMessage from '../user/userMessage.vue'

  export default {
    data() {
      return {
        showUserInfo: false,
        showUserMessage: false
      }
    },
    components: {
      MainNav, HeaderNav, FooterWrapper, UserInfo, UserMessage
    },
    created() {
      this.bus.$on('showUserInfo', () => {
        this.showUserInfo = true
      })
      this.bus.$on('hiddenUserInfo', () => {
        this.showUserInfo = false
      })
      this.bus.$on('showUserMessage', () => {
        this.showUserMessage = true
      })
      this.bus.$on('hiddenUserMessage', () => {
        this.showUserMessage = false
      })
    },
    destroyed() {
      this.bus.$off('showUserInfo')
      this.bus.$off('hiddenUserInfo')
      this.bus.$off('showUserMessage')
      this.bus.$off('hiddenUserMessage')
    },
    methods: {}
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .main .main-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .main .main-container .side-menu {
    background-color: white;
  }

  .main .main-header {
    background-color: white;
    height: 72px !important;
    border-bottom: solid 1px #D5DFED;
    min-width: 722px;
  }

  .main .main-contentWrapper {
    padding: 0 24px;
    min-width: 722px;
    padding-bottom: 60px;
  }

  .main .main-contentWrapper:after {
    display: inline-block;
    font-size: 14px;
    color: $subTitleColor;
    width: 100%;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }
</style>
