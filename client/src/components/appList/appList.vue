<template>
  <div class="applist-wrapper">
    <!--内容头部-->
    <div class="applist-header">
      <div class="left" style="position: relative">
        <div
          style="width: 120px;height: 16px;background-color: #6477F2;position: absolute;top: 30px;left: 12px;border-radius: 10px;filter: blur(10px);z-index: -1"></div>
        <el-button class="uploadWrapper button-style-main"><i class="icon-ic_upload"></i>上传应用</el-button>
        <input
          alt=""
          title="上传应用"
          ref="referenceUpload"
          accept=".ipa, .apk"
          @change="referenceUpload"
          type="file"
          style="position: absolute;top: 0px;left: 0px;width: 144px;height: 48px;opacity: 0;cursor:pointer;">
      </div>

      <div class="applist-header-right">
        <div class="platform-wrapper">
          <div class="platform-ios" :class="getActiveClass('ios')" @click="clickIosPlatform">
            <span class="platformImg icon-ic_ios"></span>
          </div>
          <div class="platform-android" :class="getActiveClass('android')" @click="clickAndroidPlatform">
            <span class="platformImg icon-ic_andr"></span>
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

    <uploadApp v-if="this.showUploadView" :teamId="this.currentTeam._id" :appFile="this.file"
               @closeUpload="closeUploadMethod"
               @uploadSuccess="uploadSuccessMethod"></uploadApp>

    <emptyView v-if="this.showEmpty"></emptyView>

  </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import UploadApp from './uploadApp.vue'
  import { getUserTeam } from '../../mgr/userMgr'
  import CollectionView from '../base/collectionView.vue'
  import EmptyView from './emptyView.vue'

  export default {
    name: 'Apps',
    data() {
      return {
        currentPlatform: '',
        dataList: [],
        originDataList: [],
        queryText: '',
        showUploadView: false,
        file: FileList,
        currentPage: 0,
        currentTeam: {},
        showEmpty: false
      }
    },
    components: {
      UploadApp, CollectionView, EmptyView
    },
    computed: {},
    methods: {
      loadAppList() {
        AppResourceApi.getAppList(this.currentTeam._id)
          .then(response => {
            this.dataList = []
            this.dataList = response.data.reverse()
            this.originDataList = this.dataList
            if (this.dataList.length === 0) {
                this.showEmpty = true
            } else {
              this.showEmpty = false
            }

            console.log(this.dataList)
          }, reject => {
            this.$message.error(reject)
            this.showEmpty = true
          })
      },
      loadMore() {
      },
      referenceUpload(e) {
        this.file = e.target.files
        if (e.target.files.length > 0) {
          this.showUploadView = true
        }
      },
      closeUploadMethod() {
        this.showUploadView = false
        this.$refs.referenceUpload.value = ''
      },
      uploadSuccessMethod() {
        this.showUploadView = false
        this.$refs.referenceUpload.value = ''
        this.loadAppList()
      },
      clickIosPlatform() {
          if (this.currentPlatform === 'ios') {
            this.currentPlatform = ''
          } else {
            this.currentPlatform = 'ios'
          }
      },
      clickAndroidPlatform() {
        if (this.currentPlatform === 'android') {
          this.currentPlatform = ''
        } else {
          this.currentPlatform = 'android'
        }
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
        this.bus.$emit('appdetail')
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
            AppResourceApi.delectApp(this.currentTeam._id, item._id).then((res) => {
              this.loadAppList()
            }, reject => {
              this.$message.error(reject)
            })
          })
          .catch(_ => {})
      }
    },
    destroyed() {
      this.bus.$off('refreshList')
    },
    mounted() {
      this.currentTeam = getUserTeam()
      this.bus.$emit('applist')
      this.bus.$on('refreshList', () => {
        this.currentTeam = getUserTeam()
        this.loadAppList()
      })
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

      this.loadAppList()
    },
    created () {
      this.$nextTick(() => {
      })
    },
    watch: {
      currentPlatform(val) {
        this.dataList = this.originDataList
        if (val === '') {
          if (this.dataList.length === 0) {
            this.showEmpty = true
          } else {
            this.showEmpty = false
          }
          return
        }
        let newArr = []
        this.dataList.forEach((item) => {
          if (item.platform === val) {
            newArr.push(item)
          }
        })
        this.dataList = newArr
        if (this.dataList.length === 0) {
          this.showEmpty = true
        } else {
          this.showEmpty = false
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .applist-wrapper {
    padding-left: 20px;
    padding-right: 20px;
    min-width: 660px;
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
    background-color: rgba(0, 0, 0, 0);
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
    vertical-align: top;
  }

  .applist-header .platform-wrapper .platform-ios {
    display: inline-block;
    width: 72px;
    height: 100%;
    text-align: center;
    border-right: solid 1px $mainColor;
    box-sizing: border-box;
    vertical-align: top;
  }
  .applist-header .platform-wrapper .platform-android {
    display: inline-block;
    width: 72px;
    height: 100%;
    text-align: center;
  }
  .platformImg {
    line-height: 48px;
    font-size: 26px;
  }

  .platformActive {
    background-color: #e0e4fc;
  }

</style>
