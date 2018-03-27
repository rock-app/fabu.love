<template>
    <div>
      <div class="detail-header">
        <div class="detail-header-top">
          <img class="appicon" :src="getIconUrl()">
          <p class="appname">{{this.appInfo.appName}}</p>
          <div class="appType-platform-wrapper">
            <div class="appType" v-show="this.appInfo.appLevel" v-html="getAppType()"></div>
            <div class="platform">
              <i class="icon-ic_ios"></i><span v-html="`适用于${this.appInfo.platform}`"></span>
            </div>
          </div>
          <div class="rightwrapper">
            <el-button class="uploadWrapper" icon="el-icon-delete">上传新版本</el-button>
            <input ref="referenceUpload" accept=".ipa, .apk"  @change="referenceUpload" type="file" style="position: absolute;top: 36px;left: 0px;width: 144px;height: 48px;opacity: 0">
            <button class="preview" @click="clickPreviewBtn">预览</button>
            <button class="delect" @click="delectApp">删除</button>
          </div>
        </div>
        <div class="detail-header-bottom">
          <ul>
            <li v-for="(item, index) in this.headerOperationData" :key="index" class="itemwrapper">
              <div class="top">
                <p class="title">{{item}}</p>
              </div>
              <div class="subWrapper" v-if="appInfo._id">
                <p class="subtitle" v-show="index !== 3">{{subTitleArr[index]}}</p>
                <table v-show="index === 3">
                  <tr>
                    <td class="tabletitle">更新方式：</td>
                    <td class="tablecontent" v-if="appInfo.strategy.updateMode">{{appInfo.strategy.updateMode}}</td>
                  </tr>
                  <tr>
                    <td class="tabletitle">限制次数：</td>
                    <td class="tablecontent" v-html="appInfo.strategy.downloadCountLimit ? appInfo.strategy.downloadCountLimit:'无限制'"></td>
                  </tr>
                  <tr>
                    <td class="tabletitle">限制ip：</td>
                    <td class="tablecontent" v-show="appInfo.strategy.blackIpList.length>0">{{appInfo.strategy.blackIpList[0]}}等{{appInfo.strategy.blackIpList.length}}个</td>
                  </tr>
                </table>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import {getUserTeam} from '../../mgr/userMgr'

  export default {
    props: {
      appInfo: {
        type: Object
      },
      subTitleArr: {
        type: Array
      }
    },
    data() {
      return {
        headerOperationData: ['Bundle ID', '下载地址', 'App Key', '更新策略'],
        team: {}
      }
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
        if (this.appInfo.icon) {
          return `${this.axios.defaults.baseURL}${this.appInfo.icon}`
        } else {
          return `${require('../../assets/logo.png')}`
        }
      },
      getAppType() {
        if (this.appInfo.appLevel === 'enterprise') {
          return '企业版'
        } else if (this.appInfo.appLevel === 'develop') {
          return '内测版'
        } else if (this.appInfo.appLevel === 'AppStore') {
          return 'AppStore版'
        } else {
          return ''
        }
      },
      referenceUpload() {

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
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .detail-header {
    width: 100%;
    height: 240px;
    background-color: $paleGrey;
    margin-top: 24px;
  }
  .detail-header-top {
    width: 100%;
    height: 120px;
    margin-bottom: 1px;
    background-color: white;
  }
  .detail-header-bottom {
    width: 100%;
    height: 120px;
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
  .detail-header-top .rightwrapper .delect {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    border: solid 1px $warmRed;
    color: $warmRed;
    font-size: 12px;
    background-color: white;
  }
  .detail-header-top .rightwrapper .preview {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    border: solid 1px $mainColor;
    color: $mainColor;
    font-size: 12px;
    background-color: white;
    margin-right: 8px;
  }
  .detail-header-top .rightwrapper .uploadWrapper {
    width: 144px;
    height: 48px;
    background-color: $mainColor;
    float: left;
    font-size: 14px;
    color: white;
    border-radius: 24px;
    border-width: 0px;
    box-shadow: 0 2px 6px rgba(115, 109, 216, 0.5);
    margin-right: 12px;
  }
  .detail-header-bottom .itemwrapper {
    display: inline-block;
    width: 23%;
    height: 120px;
    vertical-align: top;
  }
  .detail-header-bottom .itemwrapper .top {
    border-left: solid 4px $mainColor;
    width: 100%;
    height: 24px;
    margin-left: 24px;
    margin-top: 24px;
  }
  .detail-header-bottom .itemwrapper .top .title {
    font-size: 18px;
    line-height: 24px;
    margin-left: 8px;
    font-family: "PingFang SC";
    color: $mainTitleColor;
  }
  .detail-header-bottom .itemwrapper .subWrapper {
    margin-left: 36px;
    margin-top: 12px;
    height: 48px;
    width: calc(100% - 36px);
  }
  .detail-header-bottom .itemwrapper .subWrapper .subtitle {
    font-size: 14px;
    color: $subTitleColor;
    line-height: 16px;
    word-wrap: break-word;
    word-break: normal;
  }
  .detail-header-bottom .itemwrapper .subWrapper .tabletitle {
    font-size: 12px;
    color: $subTitleColor;
    width: 72px;
    line-height: 16px;
  }
  .detail-header-bottom .itemwrapper .subWrapper .tablecontent {
    font-size: 12px;
    color: $mainTitleColor;
    line-height: 16px;
  }
</style>
