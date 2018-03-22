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
        <input class="applist-header-search" v-model="queryText" type="text" placeholder="输入名称搜索">
      </div>
    </div>
    <!--应用列表-->
    <div class="applist-content">
      <el-row>
        <el-col
          class="appItem-wrapper"
          :span="7" v-for="(item,index) in dataList" :key="item.id"
          :offset="1"
          @mouseover="appItemHovered"
          @mouseout="appItemUnhovered"
        >
          <div>
            <div :style="index%2===0? `borderTopColor: #A4C639;borderLeftColor:transparent`:`borderTopColor: lightGray;borderLeftColor:transparent`" style="width: 0px;height: 0px;position: absolute;top: 0;
right: 0px;border-top: 50px solid #A4C639;border-left: 50px solid transparent">
            </div>
            <i v-show="item.platform === 'ios'" class="icon-ic_ios appItem-platform"></i>
            <i v-show="item.platform === 'android'" class="icon-ic_android appItem-platform"></i>
            <img class="appItem-icon" src="../../assets/backgroundImage.png" alt="" @click="gotoAppDetail(item)">
            <!--app信息-->
            <div class="appItem-info">
              <div class="appItem-info-namewrapper">
                <span class="icon-ic_application"></span>
                <p class="nowrap" @click="gotoAppDetail">{{item.appName}}</p>
              </div>
              <table style="width: 100%;table-layout: fixed">
                <tr>
                  <td class="appItem-info-title">短链接:</td>
                  <td>
                    <div class="appItem-info-appInfo nowrap">参数无</div>
                  </td>
                </tr>
                <tr>
                  <td class="appItem-info-title">PackageName:</td>
                  <td>
                    <div class="appItem-info-appInfo nowrap">{{item.bundleId}}</div>
                  </td>
                </tr>
                <tr>
                  <td class="appItem-info-title">最新版本:</td>
                  <td>
                    <div class="appItem-info-appInfo nowrap">参数无</div>
                  </td>
                </tr>
              </table>
            </div>
            <!--删除等操作-->
            <div class="appItem-operate">
              <div class="appItem-operate-editor appItem-operate-common" @click="clickEditorBtn">
                <span class="icon-ic_editor"></span>
                <span style="font-size: 14px">编辑</span>
              </div>
              <!--<a :href="getPreViewUrl()">-->
                <!---->
              <!--</a>-->
              <div class="appItem-operate-preview appItem-operate-common" @click.stop="clickPreview">
                <span class="icon-ic_preview"></span>
                <span style="font-size: 14px">预览</span>
              </div>
              <div class="appItem-operate-delect appItem-operate-common">
                <i class="el-icon-delete"></i>
              </div>
            </div>

            <div v-show="index === 0" class="list-firstChild" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;background-color: #F8BA0B;text-align: center">
              <img src="../../assets/uploadVersion_w.png" alt="">
              <p>拖拽到这里上传</p>
              <input ref="referenceUpload" accept=".ipa, .apk"  @change="referenceUpload" type="file" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;opacity: 0">
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <uploadApp v-if="this.showUploadView" :teamId="this.teamArr[0]._id" :appFile="this.file" v-show="this.showUploadView" @closeUpload="closeUploadMethod" @uploadSuccess="uploadSuccessMethod"></uploadApp>

  </div>
</template>

<script type="text/ecmascript-6">
  import AppListNav from './appListNav.vue'
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import UploadApp from './uploadApp.vue'
  import {getTeamArr} from '../../mgr/userMgr'

  export default {
    data() {
      return {
        currentPlatform: '',
        dataList: [{'flag': 'flag'}],
        queryText: '',
        showUploadView: false,
        file: FileList,
        currentPage: 0,
        teamArr: []
      }
    },
    components: {
      AppListNav, UploadApp
    },
    computed: {
      getTitleActiveClass() {
        if (this.hoverFlag) {
          return `color: red`
        }
      }
    },
    methods: {
      loadAppList() {
        AppResourceApi.getAppList(this.teamArr[0]._id, this.currentPage)
          .then(response => {
            console.log(response)
            this.dataList = [{'flag': 'flag'}]
            response.data.forEach((item) => {
              this.dataList.push(item)
            })
          }, reject => {
            this.$message.error(reject)
          })
      },
      referenceUpload(e) {
        this.file = e.target.files
        if (e.target.files.length > 0) {
          this.showUploadView = true
        }
      },
      closeUploadMethod() {
        this.showUploadView = false
      },
      uploadSuccessMethod() {
        this.showUploadView = false
        this.loadAppList()
      },
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
      gotoAppDetail(item) {
        this.$router.push({
          name: 'AppDetail',
          params: {appId: item._id}
        })
      },
      appItemHovered() {
      },
      appItemUnhovered() {
      },
      clickEditorBtn() {
      },
      clickPreview() {
        window.open(window.location.origin + '/appPreView', '_blank')
      }
    },
    created () {
      this.$watch('queryText', () => {
        console.log(this.queryText)
      })
      this.teamArr = getTeamArr()
      if (this.teamArr) {
        this.loadAppList()
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
    margin-left: 12%;
    margin-right: 15%;
  }
  .appItem-wrapper {
    margin-bottom: 20px;
    height: 460px;
    background-color: white;
    position: relative;
    transition: all 0.25s;
  }
  .appItem-wrapper:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(0,0,0,.1);
  }
  .appItem-wrapper:hover .appItem-info-namewrapper p {
    color: #000;
  }
  .appItem-wrapper:hover .list-firstChild img {
    transform: scale(1.5);
  }
  .appItem-wrapper .appItem-platform{
    position: absolute;
    right: 0px;
    top: 5px;
    width: 25px;
    height: 25px;
    background-size: 25px 25px;
  }
  .appItem-wrapper .appItem-icon {
    position: absolute;
    left: 45px;
    top: 50px;
    width: 100px;
    height: 100px;
    background-size: cover;
    border-radius: 10px;
    color: white;
    cursor: pointer;
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
  .appItem-info-namewrapper span {
    display: inline-block;
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
    vertical-align: top;
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
    max-width: 100%;
    line-height: 25px;
  }
  .appItem-operate i {
    margin-top: 5px;
  }
  .appItem-operate span {
    line-height: 30px;
    vertical-align: middle;
  }
  .appItem-operate-editor:hover {
    border-color: #F8BA0B;
    color: #F8BA0B;
  }
  .appItem-operate-editor:hover span:before {
    color: #F8BA0B;
  }
  .appItem-operate-preview:hover {
    border-color: #F8BA0B;
    color: #F8BA0B;
  }
  .appItem-operate-preview:hover span:before {
    color: #F8BA0B;
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
  .appItem-operate-delect:hover {
    background-color: crimson;
    border-color: transparent;
  }
  .appItem-operate-delect:hover i {
    color: white;
  }
  .list-firstChild img {
    width: 60px;
    height: 60px;
    background-size: 60px 60px;
    margin-top: 160px;
    color: white;
    transition: all 0.25s;
  }
  .list-firstChild img:hover {
    transform: scale(1.5);
  }
  .list-firstChild p {
    color: white;
    font-size: 14px;
    margin-top: 40px;
  }
  .appItem-wrapper .icon-ic_ios:before {
    color: white;
  }
  .appItem-wrapper .icon-ic_android:before {
    color: white;
  }
</style>
