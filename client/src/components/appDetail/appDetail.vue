<template>
  <div>
    <!--导航部分-->
    <appListNav :appSubModule="this.appInfo.appName"></appListNav>
    <!--头部-->
    <div class="appDetail-header">
      <img class="appicon" :src="getIconUrl()" alt="" @click="clickAppIcon">
      <div class="appDetail-appinfo">
        <div class="appDetail-appinfo-info">
          <div class="appDetail-appinfo-link">http://12121212121212</div>
          <div class="appDetail-appinfo-downloadwrapper">
            <i class="el-icon-download"></i>
            <span>21666666</span>
          </div>
          <div class="appDetail-appinfo-link appDetail-appinfo-platform" v-html="this.appInfo.platform"></div>
          <div class="appDetail-appinfo-downloadwrapper">
            <p class="appDetail-appinfo-downloadwrapper-packname">PackName</p>
            <span v-html="this.appInfo.bundleId"></span>
          </div>
        </div>
        <div class="detail-otherinfo">
          <ul>
            <li style="display: inline-block;width: 80px;height: 60px;margin-right: 25px;position: relative" v-for="item in headerOperationData" :class="getDetailotherAppInfoClass(item)" :key="item.id" @click="clickOtherInfo(item)">
              <div class="detail-otherinfo-line"></div>
              <i class="el-icon-edit"></i>
              <span class="detail-otherinfo-title" v-html="item"></span>
            </li>
          </ul>
        </div>
      </div>
      <div class="appDetail-header-rightwrapper">
        <div style="position: relative">
          <el-button class="uploadButton" type="primary"><i class="el-icon-upload el-icon--left"></i>上传</el-button>
          <input type="file" style="position: absolute;top: 30px;height: 40px;width: 150px;opacity: 0">
          <div>
        </div>
          <el-button @click="clickPreviewBtn" class="detail-preViewButton"><i class="el-icon-upload el-icon--left"></i>预览</el-button>
        </div>
      </div>
      <div style="position: absolute;left: 15%;bottom: -15px">
        <img ref="headerIndicate" class="appDetail-header-indicate" src="../../assets/indicateImg.png" alt="">
      </div>
    </div>
    <!--内容-->
    <appVersions :platform="this.appInfo.platform" :appName="this.appInfo.appName" :appId="this.$route.params.appId" v-show="this.currentModule === 'appVersions'"></appVersions>
    <appBasicInfo v-show="this.currentModule === '基本信息'"></appBasicInfo>
    <appIntegration v-show="this.currentModule === '集成'"></appIntegration>
    <authorControl v-show="this.currentModule === '权限控制'"></authorControl>
    <highSummary v-show="this.currentModule === '高级统计'"></highSummary>
    <applicationMerge v-show="this.currentModule === '应用合并'"></applicationMerge>
  </div>
</template>

<script type="text/ecmascript-6">
  import AppListNav from '../appList/appListNav.vue'
  import AppBasicInfo from './appBasicInfo.vue'
  import AppIntegration from './appIntegration.vue'
  import AuthorControl from './authorControl.vue'
  import HighSummary from './/highSummary.vue'
  import ApplicationMerge from './applicationMerge.vue'
  import AppVersions from './appVersions.vue'
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import {getUserTeam} from '../../mgr/userMgr'

  export default {
    data() {
      return {
        headerOperationData: ['基本信息', '权限控制', '应用合并', '高级统计', '集成'],
        currentModule: 'appVersions',
        userteam: {},
        appInfo: {}
      }
    },
    components: {
      AppListNav, AppBasicInfo, AppIntegration, AuthorControl, HighSummary, ApplicationMerge, AppVersions
    },
    computed: {
    },
    created() {
      this.$nextTick(() => {
        this.userteam = getUserTeam()
        this.getAppDetailData()
      })
    },
    methods: {
      getAppDetailData() {
        AppResourceApi.getAppDetail(this.userteam._id, this.$route.params.appId).then((res) => {
          console.log(res)
          this.appInfo = res.data
        }, reject => {
          this.$message.error(reject)
        })
      },
      clickAppIcon() {
        this.currentModule = 'appVersions'
        this.$refs.headerIndicate.style.marginLeft = `30px`
      },
      clickOtherInfo(item) {
        this.currentModule = item

        if (this.currentModule === 'appVersions') {
        }
        if (this.currentModule === '基本信息') {
          this.$refs.headerIndicate.style.marginLeft = `175px`
        }
        if (this.currentModule === '权限控制') {
          this.$refs.headerIndicate.style.marginLeft = `295px`
        }
        if (this.currentModule === '应用合并') {
          this.$refs.headerIndicate.style.marginLeft = `400px`
        }
        if (this.currentModule === '高级统计') {
          this.$refs.headerIndicate.style.marginLeft = `500px`
        }
        if (this.currentModule === '集成') {
          this.$refs.headerIndicate.style.marginLeft = `590px`
        }
      },
      getDetailotherAppInfoClass(item) {
        if (item === this.currentModule) {
          return 'detail-otherAppInfo-active'
        } else {
          return 'detail-otherAppInfo-nomal'
        }
      },
      clickPreviewBtn() {
        const {href} = this.$router.resolve({
          name: 'AppPreView',
          path: '/',
          params: { 'id': this.appInfo.shortUrl }
        })
        window.open(href, '_blank')
      },
      getIconUrl() {
        if (this.appInfo.icon) {
          return `${this.axios.defaults.baseURL}${this.appInfo.icon}`
        } else {
          return `${require('../../assets/logo.png')}`
        }
      }
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
    position: relative;
    border-bottom: solid 0.5px #eee;
  }
  .appDetail-header .appicon {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    background-size: cover;
    margin-top: 65px;
  }
  .appDetail-header-indicate {
    width: 40px;
    height: 40px;
    background-size: 40px 40px;
    margin-left: 30px;
    transition: margin-left  0.25s;
  }
  @keyframes indicateMove0 {
    to {
      margin-left: 30px;
    }
  }
  .appDetail-appinfo {
    flex-grow: 1;
    height: 100%;
  }
  .appDetail-header-rightwrapper {
    width: 150px;
    height: 150px;
  }
  .appDetail-appinfo-info {
    margin-top: 65px;
    padding-left: 60px;
    display: flex;
  }
  .appDetail-appinfo-link {
    height: 20px;
    padding: 0px 8px;
    border: solid 1px #999;
    font-size: 10px;
    text-align: center;
    color: #F8BA0B;
    border-color: #F8BA0B;
    border-radius: 5px;
    line-height: 20px;
    margin-right: 10px;
  }
  .appDetail-appinfo-downloadwrapper {
    height: 20px;
    border: solid 1px #999;
    border-radius: 5px;
    display: flex;
    padding: 0px 8px;
    overflow: hidden;
    margin-right: 10px;
  }
  .appDetail-appinfo-downloadwrapper i {
    width: 20px;
    height: 20px;
    border-right: solid 1px #999;
    padding-top: 2px;
  }
  .appDetail-appinfo-downloadwrapper span {
    height: 20px;
    font-size: 10px;
    margin-left: 8px;
    line-height: 20px;
  }
  .appDetail-appinfo-platform {
    color: #999;
    border-color: #999;
    margin-right: 10px;
  }
  .appDetail-appinfo-downloadwrapper-packname {
    border-right: solid 1px #999;
    font-size: 10px;
    line-height: 20px;
    padding-right: 8px;
  }
  .detail-otherinfo {
    margin-left: 60px;
    margin-top: 30px;
  }
  .detail-otherAppInfo-active {
    color: #333;
  }
  .detail-otherAppInfo-nomal {
    color: #999;
  }
  .detail-otherinfo-line {
    position: absolute;
    width: 1px;
    height: 60px;
    background-color: #999;
    top: 0px;
    left: 0px;
  }
  .el-icon-edit {
    position: absolute;
    top: 0px;
    left: 15px;
  }
  .detail-otherinfo-title {
    position: absolute;
    left: 15px;
    top: 40px;
    font-size: 15px;
  }
  .appDetail-appinfo-info .el-radio-button {
    height: 25px !important;
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
    border-color: #3AB2A7;
    color: #3AB2A7;
  }
</style>
