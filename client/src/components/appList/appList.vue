<template>
  <div>
    <!--内容头部-->
    <div class="applist-header">
      <div style="position: relative">
        <el-button class="uploadWrapper" icon="el-icon-delete">上传应用</el-button>
        <input ref="referenceUpload" accept=".ipa, .apk"  @change="referenceUpload" type="file" style="position: absolute;top: 0px;left: 0px;width: 144px;height: 48px;opacity: 0">
      </div>

      <div class="applist-header-right">
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
    </div>
    <!--应用列表-->
    <collectionView
      :dataArr="this.dataList"
      @gotoAppDetail="gotoAppDetail"
    >
    </collectionView>

    <uploadApp v-if="this.showUploadView" :teamId="this.teamArr[0]._id" :appFile="this.file" v-show="this.showUploadView" @closeUpload="closeUploadMethod" @uploadSuccess="uploadSuccessMethod"></uploadApp>

  </div>
</template>

<script type="text/ecmascript-6">
  import AppListNav from './appListNav.vue'
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import UploadApp from './uploadApp.vue'
  import {getTeamArr} from '../../mgr/userMgr'
  import CollectionView from '../base/collectionView.vue'
  import Bus from '../../common/js/bus'

  export default {
    data() {
      return {
        currentPlatform: '',
        dataList: [],
        queryText: '',
        showUploadView: false,
        file: FileList,
        currentPage: 0,
        teamArr: []
      }
    },
    components: {
      AppListNav, UploadApp, CollectionView
    },
    computed: {
    },
    methods: {
      loadAppList() {
        AppResourceApi.getAppList(this.teamArr[0]._id, this.currentPage)
          .then(response => {
            console.log(response)
            this.dataList = []
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
        Bus.$emit('appdetail')
      },
      appItemHovered() {
      },
      appItemUnhovered() {
      },
      clickEditorBtn() {
      },
      clickPreview() {
      },
      delectApp(item) {
        this.$confirm('确认删除？')
          .then(_ => {
            AppResourceApi.delectApp(this.teamArr[0]._id, item._id).then((res) => {
              this.loadAppList()
            }, reject => {
              this.$message.error(reject)
            })
          })
          .catch(_ => {})
      }
    },
    created () {
      Bus.$emit('applist')
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
    height: 75px;
    padding-top: 25px;
  }
  .applist-header .uploadWrapper {
    width: 144px;
    height: 48px;
    background-color: $mainColor;
    float: left;
    font-size: 14px;
    color: white;
    border-radius: 24px;
    border-width: 0px;
    box-shadow: 0 2px 6px rgba(115, 109, 216, 0.5);
  }
  .applist-header-right {
    float: right;
  }
  .applist-header .search-wrapper {
    width: 312px;
    height: 48px;
    border-radius: 24px;
    border: solid 1px $mainColor;
    position: relative;
    display: inline-block;
  }
  .el-icon-search {
    position: absolute;
    left: 15px;
    top: 17px;
    color: $mainColor;
  }
  .applist-header-search {
    position: absolute;
    left: 45px;
    top: 0px;
    width: 235px;
    height: 50px;
    background-color: rgba(0,0,0,0);
    outline: 0;
    color: $mainColor;
  }
  .applist-header-search::-webkit-input-placeholder {
    color: $mainColor;
  }
  .applist-header-search:-moz-placeholder {
    color: $mainColor;
  }
  .applist-header-search:-ms-input-placeholder {
    color: $mainColor;
  }
  .applist-header .platform-wrapper {
    display: inline-block;
    width: 144px;
    height: 48px;
    border-radius: 24px;
    overflow: hidden;
    font-size: 0px;
    border: solid 1px $mainColor;
    margin-right: 22px;
  }
  .applist-header .platform-wrapper .platform-ios {
    display: inline-block;
    width: 72px;
    height: 100%;
    text-align: center;
    border-right: solid 1px $mainColor;
    box-sizing: border-box;
  }
  .applist-header .platform-wrapper .platform-android {
    display: inline-block;
    width: 72px;
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

</style>
