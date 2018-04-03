<template>
  <div class="applist-wrapper">
    <!--内容头部-->
    <div class="applist-header">
      <div style="position: relative">
        <div style="width: 120px;height: 16px;background-color: #6477F2;position: absolute;top: 30px;left: 12px;border-radius: 10px;filter: blur(10px);z-index: -1"></div>
        <el-button class="uploadWrapper button-style-main"><i class="icon-ic_upload"></i>上传应用</el-button>
        <input ref="referenceUpload" accept=".ipa, .apk"  @change="referenceUpload" type="file" style="position: absolute;top: 0px;left: 0px;width: 144px;height: 48px;opacity: 0;cursor:pointer;">
      </div>

      <div class="applist-header-right">
        <div class="platform-wrapper">
          <div class="platform-ios" :class="getActiveClass('ios')" @click="clickIosPlatform">
            <img class="platformImg" src="../../assets/ic_ios.png" alt="">
          </div>
          <div class="platform-android" :class="getActiveClass('android')" @click="clickAndroidPlatform">
            <img class="platformImg" src="../../assets/ic_android.png" alt="">
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

    <!--<div v-show="!busy" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">-->
      <!--加载中-->
    <!--</div>-->

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
        originDataList: [],
        queryText: '',
        showUploadView: false,
        file: FileList,
        currentPage: 0,
        teamArr: [],
        busy: true
      }
    },
    components: {
      AppListNav, UploadApp, CollectionView
    },
    computed: {
    },
    methods: {
      loadAppList(isfooter) {
        if (isfooter) {
          this.currentPage = this.currentPage + 1
        } else {
          this.currentPage = 0
        }
        AppResourceApi.getAppList(this.teamArr[0]._id, this.currentPage)
          .then(response => {
            console.log(response)
            if (isfooter) {
              this.dataList = this.dataList.concat(response.data)
              if (response.data.length === 0) {
                this.busy = true
              } else {
                this.busy = false
              }
            } else {
              this.dataList = []
              this.dataList = response.data
              this.busy = false
            }
            this.originDataList = this.dataList
          }, reject => {
            this.$message.error(reject)
          })
      },
      loadMore() {
        this.busy = true
        setTimeout(() => {
          this.loadAppList(true)
        }, 800)
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
        let newArr = []
        this.dataList.forEach((item) => {
          if (item.appName.search(this.queryText) !== -1) {
            newArr.push(item)
          }
        })
        this.dataList = newArr

        if (this.queryText.length === 0) {
          this.dataList = this.originDataList
        }
      })
      this.teamArr = getTeamArr()
      if (this.teamArr) {
        this.loadAppList(false)
      }
    },
    watch: {
      currentPlatform(val) {
        console.log(val)
        this.dataList = this.originDataList
        let newArr = []
        this.dataList.forEach((item) => {
          if (item.platform === val) {
            newArr.push(item)
          }
        })
        this.dataList = newArr
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .applist-wrapper {
    padding-left: 20px;
    padding-right: 20px;
  }
  .applist-header {
    height: 75px;
    padding-top: 25px;
  }
  .applist-header .uploadWrapper {
    width: 144px;
    float: left;
  }
  .applist-header .uploadWrapper i {
    margin-right: 15px;
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
    background-color: #ddd;
  }

</style>
