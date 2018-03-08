<template>
  <div>
    <!--导航部分-->
    <appListNav></appListNav>
    <!--内容头部-->
    <div class="applist-header">
      <div class="platform-wrapper">
        <div class="platform-ios" :class="getActiveClass('ios')" @click="clickIosPlatform">
          <img class="platformImg" src="../../assets/ios.png" alt="">
        </div>
        <div class="platform-android" :class="getActiveClass('android')" @click="clickAndroidPlatform">
          <img class="platformImg" src="../../assets/android.png" alt="">
        </div>
      </div>
      <div class="search-wrapper">
        <i class="el-icon-search"></i>
        <input class="applist-header-search" type="text" placeholder="输入名称搜索">
      </div>
    </div>
    <!--应用列表-->
    <div class="applist-content">
      <el-row>
        <el-col class="appItem-wrapper" :span="7" v-for="(o) in 20" :key="o" :offset="1">
          <el-card :body-style="{ padding: '0px'}">
            <img class="appItem-platform" src="../../assets/android.png" alt="">
            <img class="appItem-icon" src="../../assets/backgroundImage.png" alt="">
            <!--app信息-->
            <div class="appItem-info">
              <div class="appItem-info-namewrapper">
                <img src="../../assets/android.png" alt="">
                <p class="nowrap" @click="gotoAppDetail">订货宝</p>
              </div>
              <table>
                <tr>
                  <td class="appItem-info-title">短链接:</td>
                  <td>
                    <div class="appItem-info-appInfo nowrap">http://fir.im/xiaoutrialxiaoutrial</div>
                  </td>
                </tr>
                <tr>
                  <td class="appItem-info-title">PackageName:</td>
                  <td>
                    <div class="appItem-info-appInfo nowrap">com.hd123.xiaoutrialxiaoutrialxiaoutrial</div>
                  </td>
                </tr>
                <tr>
                  <td class="appItem-info-title">最新版本:</td>
                  <td>
                    <div class="appItem-info-appInfo nowrap">1.0_build_12141046 ( Build 1 )</div>
                  </td>
                </tr>
              </table>
            </div>
            <!--删除等操作-->
            <div class="appItem-operate">
              <div class="appItem-operate-editor appItem-operate-common">
                <i class="el-icon-edit" style="margin-top: 5px"></i>
                <span style="font-size: 14px">编辑</span>
              </div>
              <div class="appItem-operate-preview appItem-operate-common">
                <i class="el-icon-edit" style="margin-top: 5px"></i>
                <span style="font-size: 14px">预览</span>
              </div>
              <div class="appItem-operate-delect appItem-operate-common">
                <i class="el-icon-delete" style="margin-top: 5px"></i>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import AppListNav from './appListNav.vue'

  export default {
    data() {
      return {
        currentPlatform: '',
        dataList: ['1', '2', '3', '4', '5']
      }
    },
    components: {
      AppListNav
    },
    computed: {
    },
    methods: {
      clickIosPlatform() {
        this.currentPlatform = 'ios'
      },
      clickAndroidPlatform() {
        this.currentPlatform = 'android'
      },
      getActiveClass(flag) {
        if (flag === this.currentPlatform) {
          return 'platformActive'
        }
      },
      gotoAppDetail() {
        this.$router.push('appDetail')
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";
  .applist-header {
    margin-left: 15%;
    margin-top: 50px;
    height: 50px;
    margin-bottom: 60px;
  }
  .applist-header .platform-wrapper {
    width: 120px;
    height: 50px;
    border-radius: 25px;
    overflow: hidden;
    font-size: 0px;
    border: solid 1px #999;
    display: inline-block;
  }
  .applist-header .platform-wrapper .platform-ios {
    display: inline-block;
    width: 60px;
    height: 100%;
    text-align: center;
    border-right: solid 1px #999;
    box-sizing: border-box;
  }
  .applist-header .platform-wrapper .platform-android {
    display: inline-block;
    width: 60px;
    height: 100%;
    text-align: center;
  }
  .platformImg {
    width: 25px;
    height: 25px;
    margin-top: 11px;
  }
  .platformActive {
    background-color: #9b9b9b;
  }
  .applist-header .search-wrapper {
    display: inline-block;
    width: 280px;
    height: 50px;
    border-radius: 25px;
    border: solid 1px #999;
    margin-left: 20px;
    position: relative;
  }
  .el-icon-search {
    position: absolute;
    left: 15px;
    top: 17px;
  }
  .applist-header-search {
    position: absolute;
    left: 45px;
    top: 0px;
    width: 235px;
    height: 50px;
    background-color: rgba(0,0,0,0);
    outline: 0;
  }
  .applist-content {
    margin-left: 15%;
    margin-right: 15%;
  }
  .image {
    width: 100%;
    display: block;
  }
  .appItem-wrapper {
    margin-bottom: 20px;
    height: 460px;
    background-color: white;
    position: relative;
  }
  .appItem-wrapper .appItem-platform {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 50px;
    height: 50px;
    background-size: 50px 50px;
  }
  .appItem-wrapper .appItem-icon {
    position: absolute;
    left: 45px;
    top: 50px;
    width: 100px;
    height: 100px;
    background-size: cover;
    border-radius: 10px;
  }
  .appItem-wrapper .appItem-info {
    position: absolute;
    left: 45px;
    top: 190px;
    right: 45px;
    height: 120px;
    overflow: hidden;
  }
  .appItem-wrapper .appItem-operate {
    position: absolute;
    left: 45px;
    right: 45px;
    bottom: 50px;
    height: 30px;
    display: flex;
    flex-direction: row;
    text-align: center;
    color: #999;
  }
  .appItem-info-namewrapper {
    height: 40px;
  }
  .appItem-info-namewrapper img {
    width: 25px;
    height: 25px;
    background-size: cover;
  }
  .appItem-info-namewrapper p {
    font-size: 18px;
    cursor: pointer;
    display: inline-block;
    color: #666;
    font-weight: 300;
  }
  .appItem-info-namewrapper p:hover{
    color: #000;
  }
  .appItem-info-title {
    font-size: 10px;
    color: #999;
  }
  .appItem-info-appInfo {
    font-size: 10px;
    color: #333;
    max-width: 70%;
    line-height: 25px;
  }
  .appItem-operate-common {
    border: solid 1px #999;
    height: 100%;
    width: 32%;
    margin-right: 5%;
    border-radius: 15px;
  }
  .appItem-operate-delect {
    width: 30px;
    text-align: center;
  }
</style>
