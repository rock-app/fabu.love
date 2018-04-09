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
          <router-view></router-view>
        </el-main>
        <!--<el-footer style="background-color: transparent">-->
          <!--<footerWrapper class="footerWrapper"></footerWrapper>-->
        <!--</el-footer>-->
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
  .main-contentWrapper:after {
    display: inline-block;
    content: '版权所有 © 2005-2017 上海海鼎信息工程股份有限公司，并保留所有权利。';
    font-size: 14px;
    color: $subTitleColor;
    width: 100%;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }
  .main-container .side-menu {
    width: 192px;
  }
  .footerWrapper {
    margin-bottom: 40px;
  }
</style>
