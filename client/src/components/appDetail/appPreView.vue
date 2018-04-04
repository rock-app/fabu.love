

<template>
    <div class="previewapp-wrapper">
      <!--中间-->
      <div class="preview-middlewrapper">
        <img class="appicon" :src="getIconUrl()" alt="">
        <p class="title">{{this.appBaseData.appName}}</p>
        <p class="desc">版本： {{this.appVersionInfo.versionStr}}   大小：{{(this.appVersionInfo.size/1024/1024).toFixed(1)}}M / {{this.appVersionInfo.creatDateStr}}</p>
        <p class="date">发布日期： {{ this.appVersionInfo.creatDateStr }} </p>
        <el-button @click="clickDownLoadBtn" icon="el-icon-search"  class="downloadBtn" type="primary" round>下载安装</el-button>
      </div>
      <!--手机视图-->
      <div class="preview-mobilewrapper">
        <img class="mobieImg" src='../../assets/ic_mobilphone.png'>
        <vue-qr class="qrcodeImg" :text="downloadUrl" height="140" width="140" margin="20"></vue-qr>
        <p class="codetips">请扫描二维码下载APP</p>
        <p class="platform">适用于{{this.platformStr}}系统</p>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import VueQr from 'vue-qr'

  export default {
    components: {
      VueQr
    },
    data() {
      return {
        versionArr: [['1.3.4', '2017-03-12'], ['1.3.3', '2017-03-11'], ['1.3.2', '2017-03-10'], ['1.3.1', '2017-03-9']],
        appVersionInfo: {},
        appBaseData: {},
        downloadUrl: '',
        platformStr: ''
      }
    },
    computed: {
    },
    created() {
      console.log(this.$route.params)
      this.getAppInfo(this.$route.params.id)
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
          this.appVersionInfo = res.data.version
          this.appBaseData = res.data.app
          let releaseDate = new Date(this.appVersionInfo.uploadAt)
          this.downloadUrl = `${this.axios.defaults.baseURL}${this.appVersionInfo.downloadUrl}`
          this.platformStr = res.data.app.platform
          this.appVersionInfo.creatDateStr = `${releaseDate.getFullYear()}-${releaseDate.getMonth() + 1}-${releaseDate.getDate()}`

        }, reject => {

        })
      },
      getIconUrl() {
        if (this.appBaseData.icon) {
          return `${this.axios.defaults.baseURL}${this.appBaseData.icon}`
        } else {
          return `${require('../../assets/logo.png')}`
        }
      },
      clickDownLoadBtn() {
        const a = document.createElement('a')
        a.setAttribute('href', this.downloadUrl)
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
    background-image: url("../../assets/bg_picture.png");
    background-size: cover;
  }
  .preview-middlewrapper {
    margin-top: 0px;
    margin-left: 25%;
    width: 25%;
    display: flex;
    flex-direction: column;
    text-align: center;
    position: absolute;
  }
  .preview-mobilewrapper {
    margin-top: 170px;
    width: 359px;
    height: 561px;
    left: 51%;
    position: absolute;
  }

  .preview-middlewrapper .appicon {
    width: 126px;
    height: 126px;
    margin-top: 260px;
    margin-left: 10%;
  }

  .preview-middlewrapper .title {
    color: #354052;
    font-weight: bold;
    font-size: 26px;
    float: left;
    text-align: left;
    height: 37px;
    line-height: 37px;
    margin-left: 10%;
    margin-top: 33px;
  }
  .preview-middlewrapper .desc {
    color: #242A34;
    font-size: 14px;
    text-align: left;
    line-height: 20px;
    margin-left: 10%;
    margin-top: 12px;
    width: 100px;
    opacity: 0.5;
  }
  .preview-middlewrapper .date {
    color: #242A34;
    font-size: 14px;
    text-align: left;
    line-height: 20px;
    margin-top: 2px;
    margin-left: 10%;
    opacity: 0.5;
  }
  .preview-middlewrapper .downloadBtn{
    background-color: #8393F5;
    width: 184px;
    height: 44px;
    color: white;
    font-size: 14px;
    margin-top: 16px;
    margin-left: 10%;
    border-color: transparent;
    /*float: left;*/
  }
  .preview-mobilewrapper .mobieImg {
    width: 359px;
    height: 561px;
    margin-left: 0px;
    margin-top: 0px;
    position: absolute;
    icon: url('../../assets/ic_apple.png');
  }
  .preview-mobilewrapper .qrcodeImg {
    width: 160px;
    height: 160px;
    margin-left: 26px;
    margin-top: 86px;
    position: absolute;
  }

  .preview-mobilewrapper .codetips {
    color: #354052;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    float: left;
    height: 20px;
    margin-left: 55px;
    margin-top: 288px;
    width: 140px;
    position: absolute;
  }
  .preview-mobilewrapper .platform {
    color: #354052;
    opacity: 0.5;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    float: left;
    height: 20px;
    margin-left: 55px;
    margin-top: 312px;
    width: 140px;
    position: absolute;
  }

</style>
