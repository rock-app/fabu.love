<template>
    <div class="previewapp-wrapper">
      <!--左边-->
      <div class="preview-leftwrapper"></div>
      <!--中间-->
      <div class="preview-middlewrapper">
        <div class="preview-middlewrapper-header">
          <p class="title">{{this.appName}}</p>
          <p class="desc">版本： {{this.appInfo.versionStr}}/ 大小：{{(this.appInfo.size/1024/1024).toFixed(1)}}M / {{this.appInfo.creatDateStr}}</p>
        </div>
        <img class="preview-middlewrapper-appicon" :src="getIconUrl()" alt="">
        <button class="preview-middlewrapper-downloadBtn" @click="clickDownLoadBtn">点击下载</button>
        <button class="preview-middlewrapper-appdesc">适用于{{this.platform}}设备</button>
        <hr class="preview-middlewrapper-line">
        <div class="preview-middlewrapper-downloaddesc">或者用手机扫描二维码下载</div>
        <img class="preview-middlewrapper-ercode" src="../../assets/backgroundImage.png" alt="">
        <hr class="preview-middlewrapper-line" style="margin-top: 80px">
        <div class="preview-middlewrapper-oldVersion">
          <div style="background-color: #3AB2A7;width: 100%;height: 44px;line-height: 44px;font-size: 14px;font-weight: bold;text-align: left;padding-left: 10px;color: white;">历史版本</div>
          <table class="preview-middlewrapper-oldVersion-item" v-for="(item, index) in versionArr" :key="index">
            <tr :style="getTableBackground(index)">
              <td>{{item[0]}}</td>
              <td>{{item[1]}}</td>
            </tr>
          </table>
          <div style="width: 100%;height: 40px;background-color: bisque;font-size: 14px;color: #333;line-height: 40px">查看更多</div>
        </div>
      </div>
      <!--右边-->
      <div class="preview-rightwrapper"></div>
    </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'

  export default {
    data() {
      return {
        versionArr: [['1.3.4', '2017-03-12'], ['1.3.3', '2017-03-11'], ['1.3.2', '2017-03-10'], ['1.3.1', '2017-03-9']],
        appId: '',
        versionId: '',
        teamId: '',
        appInfo: {},
        appName: '',
        platform: ''
      }
    },
    computed: {
    },
    created() {
      this.appId = this.$route.query.appId
      this.versionId = this.$route.query.versionId
      this.teamId = this.$route.query.teamId
      this.appName = this.$route.query.appName
      this.platform = this.$route.query.platform
      console.log(this.$route.params)
      this.getAppInfo(this.$route.params.id)
//      this.loadData()
    },
    methods: {
      getTableBackground(index) {
        if (index % 2 === 0) {
          return `backgroundColor: rgb(244, 245, 247)`
        } else {
          return `backgroundColor: white`
        }
      },
      getAppInfo(shortUrl) {
        AppResourceApi.getAppInfoByShortUrl(shortUrl).then((res) => {
          console.log(res)
        }, reject => {

        })
      },
      loadData() {
        AppResourceApi.getAppVersionDetail(this.teamId, this.appId, this.versionId).then((res) => {
          console.log(res)
          this.appInfo = res.data
          let releaseDate = new Date(this.appInfo.uploadAt)
          this.appInfo.creatDateStr = `${releaseDate.getFullYear()}-${releaseDate.getMonth() + 1}-${releaseDate.getDate()}`

        }, reject => {

        })
      },
      getIconUrl() {
        if (this.appInfo.icon) {
          return `${this.axios.defaults.baseURL}${this.appInfo.icon}`
        } else {
          return `${require('../../assets/logo.png')}`
        }
      },
      clickDownLoadBtn() {
        const a = document.createElement('a')
        a.setAttribute('href', `${this.axios.defaults.baseURL}${this.appInfo.downloadUrl}`)
        a.click()
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";
  body{
    background-color: white;
  }
  .previewapp-wrapper {
    position: absolute;
    background-color: white;
    width: 100%;
    height: 100%;
  }
  .preview-leftwrapper {
    float: left;
    margin-top: 0;
    width: 15%;
    margin-left: 0;
    height: 100%;
    background-image: url("../../assets/download_pattern_left.png");
    background-size: cover;
  }
  .preview-rightwrapper {
    position: absolute;
    top: 0;
    width: 15%;
    right: 0;
    height: 100%;
    background-image: url("../../assets/download_pattern_right.png");
    background-size: cover;
  }
  .preview-middlewrapper {
    margin-top: 0px;
    width: 70%;
    margin-left: 15%;
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .preview-middlewrapper-header {
    width: 100%;
    height: 80px;
    border-bottom: solid 1px $paleGrey;
  }
  .preview-middlewrapper-header .title {
    color: #333;
    font-weight: bold;
    font-size: 20px;
    float: left;
    line-height: 80px;
    margin-left: 10%;
  }
  .preview-middlewrapper-header .desc {
    color: #333;
    font-size: 14px;
    float: right;
    line-height: 80px;
  }
  .preview-middlewrapper-appicon {
    width: 100px;
    height: 100px;
    background-size: 100px 100px;
    margin: 0 auto;
    margin-top: 80px;
    border-radius: 10px;
  }
  .preview-middlewrapper-downloadBtn{
    background-color: #3AB2A7;
    width: 120px;
    height: 40px;
    color: white;
    font-size: 18px;
    font-weight: bold;
    margin: 0 auto;
    margin-top: 30px;
    border-color: transparent;
  }
  .preview-middlewrapper-appdesc {
    color: white;
    background-color: green;
    height: 25px;
    font-size: 12px;
    border-radius: 3px;
    margin: 0 auto;
    margin-top: 20px;
    border-color: transparent;
  }
  .preview-middlewrapper-downloaddesc {
    font-size: 14px;
    color: #333;
  }
  .preview-middlewrapper-ercode {
    width: 150px;
    height: 150px;
    background-size: cover;
    margin: 0 auto;
    margin-top: 30px;
    transition: all 0.6s;
  }
  .preview-middlewrapper-ercode:hover {
    transform: scale(2);
  }
  .preview-middlewrapper-line {
    border-top: 2px dotted #eee;
    width: 100%;
    height: 1px;
    border-left: solid 0px;
    border-bottom: solid 0px;
    border-right: solid 0px;
    margin-top: 40px;
    margin-bottom: 30px
  }
  .preview-middlewrapper-oldVersion {
    width: 70%;
    margin: 0 auto;
    border: solid 1px #3AB2A7;
    margin-bottom: 100px;
    overflow: hidden;
  }
  .preview-middlewrapper-oldVersion-item {
    width: 100%;
  }
  .preview-middlewrapper-oldVersion-item tr {
    width: 100%;
    height: 44px;
    background-color: white;
    border-bottom: solid 1px $paleGrey;
  }
  .preview-middlewrapper-oldVersion-item td {
    line-height: 44px;
    width: 50%;
  }
</style>
