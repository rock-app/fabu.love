<template>
  <div class="mainNav-wrapper">
    <div class="mainNav-logo">
      <i class="el-icon-menu"></i>
    </div>

    <slot name="main-nav"></slot>
    <slot name="detail-nav"></slot>

    <div class="mainNav-footer">
      <el-menu
        default-active=""
        class="mainNav-footer-list"
      >
        <el-menu-item index="0">
          <i class="el-icon-menu"></i>
          <span slot="title">API文档</span>
        </el-menu-item>
        <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">Help</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-setting"></i>
          <span slot="title">GitHub</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-setting"></i>
          <span slot="title">About</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {}
    },
    created() {},
    methods: {
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .mainNav-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .mainNav-logo {
    width: 100%;
    height: 72px;
  }
  .el-menu-vertical-demo {
    margin-top: 28px;
    border-right-width: 0px;
  }
  .mainNav-wrapper .el-menu-vertical-demo .el-menu-item span {
    color: $mainTitleColor;
    font-size: 20px;
  }
  .mainNav-footer {
    position: absolute;
    bottom: 30px;
    left: 0px;
    width: 100%;
  }
  .mainNav-footer .mainNav-footer-list {
    border-right-width: 0px;
  }
  .mainNav-footer .mainNav-footer-list .el-menu-item {
    height: 48px;
    line-height: 48px;
  }
  .mainNav-footer .mainNav-footer-list .el-menu-item span {
    color: $subTitleColor;
    font-size: 16px;
    line-height: 24px;
  }
  .mainNav-footer .mainNav-footer-list .is-active {
    color: $mainColor;
  }
  .mainNav-footer .mainNav-footer-list .is-active span {
    color: $mainColor;
  }
</style>
