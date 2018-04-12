<template>
    <div>
      <div class="detail-header">
        <div class="detail-header-top">
          <img class="appicon" v-lazy="getIconUrl()">
          <p class="appname">{{this.appInfo.appName}}</p>
          <div class="appType-platform-wrapper">
            <div class="appType" v-show="this.appInfo.appLevel" v-html="getAppType()"></div>
            <div class="platform">
              <i :class="this.appInfo.platform === 'ios' ? 'icon-ic_ios':'icon-ic_andr'"></i><span v-html="`  适用于${this.appInfo.platform}`"></span>
            </div>
          </div>
          <div class="rightwrapper" style="z-index: 1">

            <el-button class="uploadWrapper button-style-main"><i class="icon-ic_upload"></i>上传新版本</el-button>
            <input
              title="上传应用"
              ref="referenceUpload"
              accept=".ipa, .apk"
              @change="referenceUpload"
              type="file" style="position: absolute;top: 36px;left: 0px;width: 144px;height: 48px;opacity: 0;cursor:pointer">
            <button class="preview button-style-border" @click="clickPreviewBtn">预览</button>
            <button class="delete button-style-border" @click="delectApp">删除</button>

            <div style="width: 120px;height: 16px;background-color: #6477F2;position: absolute;top: 68px;left: 36px;border-radius: 10px;filter: blur(10px);z-index: -1"></div>

          </div>
        </div>
      </div>

      <uploadApp v-if="this.showUploadView"
                 :teamId="this.team._id"
                 :appFile="this.file"
                 @closeUpload="closeUploadMethod"
                 @uploadSuccess="uploadSuccessMethod"></uploadApp>
    </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import {getUserTeam} from '../../mgr/userMgr'
  import UploadApp from '../appList/uploadApp.vue'

  export default {
    props: {
      appInfo: {
        type: Object
      }
    },
    data() {
      return {
        team: {},
        showUploadView: false,
        file: FileList
      }
    },
    components: {
      UploadApp
    },
    created() {
      this.team = getUserTeam()
    },
    methods: {
      clickPreviewBtn() {
        const {href} = this.$router.resolve({
          name: 'AppPreView',
          path: '/',
          params: { 'id': this.appInfo.shortUrl }
        })
        window.open(href, '_blank')
      },
      getIconUrl() {
        return `${this.axios.defaults.baseURL}${this.appInfo.icon}`
      },
      getAppType() {
        if (this.appInfo.appLevel === 'enterprise') {
          return '企业版'
        } else if (this.appInfo.appLevel === 'develop') {
          return '内测版'
        } else if (this.appInfo.appLevel === 'appstore') {
          return 'AppStore版'
        } else {
          return ''
        }
      },
      referenceUpload(e) {
        this.file = e.target.files
        console.log(this.file)
        if (e.target.files.length > 0) {
          this.showUploadView = true
        }
      },
      delectApp(item) {
        this.$confirm('确认删除？')
          .then(_ => {
            AppResourceApi.delectApp(this.team._id, this.appInfo._id).then((res) => {
              this.$message.success('删除成功')
              this.$router.go(-1)
            }, reject => {
              this.$message.error(reject)
            })
          })
          .catch(_ => {})
      },
      closeUploadMethod() {
        this.showUploadView = false
        // 置空，input file 如果第二次选择的文件跟上一次是同一个文件，则不会触发onchange事件，需要将value置空
        this.$refs.referenceUpload.value = ''
      },
      uploadSuccessMethod() {
        this.$refs.referenceUpload.value = ''
        this.showUploadView = false
        // 上传成功
        this.bus.$emit('uploadSuccess')
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .detail-header {
    width: 100%;
    background-color: $paleGrey;
    margin-top: 24px;
  }
  .detail-header-top {
    width: 100%;
    height: 120px;
    margin-bottom: 1px;
    background-color: white;
  }
  .detail-header-top {
    position: relative;
  }
  .detail-header-top .appicon {
    position: absolute;
    top: 24px;
    left: 24px;
    width: 72px;
    height: 72px;
    background-size: cover;
    border-radius: 8px;
  }
  .detail-header-top .appname {
    position: absolute;
    top: 24px;
    left: 120px;
    line-height: 24px;
    font-size: 24px;
    font-family: "PingFang SC";
  }
  .detail-header-top .appType-platform-wrapper {
    position: absolute;
    top: 75px;
    left: 120px;
    font-size: 0px;
  }
  .appType-platform-wrapper .appType {
    display: inline-block;
    line-height: 12px;
    font-size: 12px;
    padding: 3px 6px;
    background-color: $originOne;
    border-radius: 2px;
    color: white;
    margin-right: 24px;
  }
  .appType-platform-wrapper .platform {
    display: inline-block;
    font-size: 14px;
    color: $subTitleColor;
  }
  .detail-header-top .rightwrapper {
    float: right;
    margin-right: 0px;
    padding: 36px 24px;
    position: relative;
  }
  .detail-header-top .rightwrapper .delete {
    width: 48px;
    border-color: $warmRed;
    color: $warmRed;
  }
  .detail-header-top .rightwrapper .preview {
    width: 48px;
    margin-right: 8px;
  }
  .detail-header-top .rightwrapper .uploadWrapper {
    width: 144px;
    float: left;
    margin-right: 12px;
  }
  .detail-header-top .rightwrapper .uploadWrapper i {
    margin-right: 15px;
  }
</style>
