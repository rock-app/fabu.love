<template>
  <div>
    <!--导航部分-->
    <appListNav appSubModule="订货宝"></appListNav>
    <div class="appDetail-header">
      <img src="../../assets/backgroundImage.png" alt="">
      <div class="appDetail-appinfo"></div>
      <div class="appDetail-header-rightwrapper">
        <el-button class="uploadButton" type="primary"><i class="el-icon-upload el-icon--left"></i>上传</el-button>
        <div>
          <el-button class="detail-preViewButton"><i class="el-icon-upload el-icon--left"></i>预览</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import AppListNav from './appListNav.vue'

  export default {
    data() {
      return {
      }
    },
    components: {
      AppListNav
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .appDetail-header {
    height: 225px;
    background-color: white;
    margin-top: 1px;
    padding-left: 15%;
    padding-right: 15%;
    display: flex;
    flex-direction: row;
  }
  .appDetail-header img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    background-size: cover;
    margin-top: 65px;
  }
  .appDetail-appinfo {
    flex-grow: 1;
    height: 100%;
    background-color: blue;
  }
  .appDetail-header-rightwrapper {
    width: 150px;
    height: 150px;
  }
  .uploadButton {
    width: 150px;
    background-color: #3AB2A7 !important;
    border-color: #3AB2A7 !important;
    margin-top: 30px;
  }
  .detail-preViewButton {
    width: 150px;
    margin-top: 10px;
  }
</style>
