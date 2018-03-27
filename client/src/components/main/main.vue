<template>
  <div>
    <el-container class="main-container">
      <el-aside width="190px" class="main-aside">
        <mainNav>
          <div slot="main-nav" v-if="this.slotName === 'main-nav'">
            <el-menu
              default-active=""
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose">
              <el-menu-item index="0">
                <i class="el-icon-menu"></i>
                <span slot="title">创建团队</span>
              </el-menu-item>
              <el-menu-item index="1">
                <i class="el-icon-menu"></i>
                <span slot="title">团队管理</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-setting"></i>
                <span slot="title">邀请队员</span>
              </el-menu-item>
            </el-menu>
          </div>
          <div slot="detail-nav" v-if="this.slotName === 'detail-nav'">
            <el-menu
              default-active=""
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose">
              <el-menu-item index="应用概述">
                <i class="el-icon-menu"></i>
                <span slot="title">应用概述</span>
              </el-menu-item>
              <el-menu-item index="应用设置">
                <i class="el-icon-menu"></i>
                <span slot="title">应用设置</span>
              </el-menu-item>
            </el-menu>
          </div>
        </mainNav>
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
  import Bus from '../../common/js/bus'

  export default {
    data() {
      return {
        slotName: 'main-nav'
      }
    },
    components: {
      MainNav, HeaderNav, FooterWrapper, AppList
    },
    created() {
      Bus.$on('appdetail', () => {
        this.slotName = 'detail-nav'
      })
      Bus.$on('applist', () => {
        this.slotName = 'main-nav'
        this.$router.push('/apps')
      })
    },
    methods: {
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      }
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
  .main-aside {
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
    padding: 0 45px;
  }
</style>
