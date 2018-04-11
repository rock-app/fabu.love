

<template>
    <div class="previewapp-wrapper">
      <!--中间-->
      <div class="preview-middlewrapper" v-if="this.appBaseData">
        <div class="left">
          <img class="appicon" :src="getIconUrl()" alt="">
          <p class="title">{{this.appBaseData.appName}}</p>
          <div class="info">
            <p class="desc">版本：{{this.appVersionInfo.versionStr}}</p><span>大小：{{(this.appVersionInfo.size/1024/1024).toFixed(1)}}M</span>
          </div>
          <p class="date">发布日期： {{ this.appVersionInfo.creatDateStr }} </p>
          <el-button @click="clickDownLoadBtn" class="downloadBtn" type="primary" round><i :class="this.platformStr === 'ios' ? 'icon-ic_ios':'icon-ic_andr'"></i>    下载安装</el-button>
        </div>


        <!--手机视图-->
        <div class="preview-mobilewrapper" v-show="this.showQRCode">
          <img class="mobieImg" src='../../assets/ic_mobilphone.png'>
          <vue-qr class="qrcodeImg" :text="downloadUrl" :margin="20"></vue-qr>
          <p class="codetips">请扫描二维码下载APP</p>
          <p class="platform">适用于{{this.platformStr}}系统</p>
        </div>
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
        appBaseData: null,
        downloadUrl: '',
        platformStr: '',
        showQRCode: false
      }
    },
    computed: {
      isIos() {
        var u = navigator.userAgent
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        return isiOS
      },
      isAndroid() {
        var u = navigator.userAgent
        var isAndroid = !!(u.match(/(Android)\s+([\d.]+)/))
        return isAndroid
      }
    },
    created() {
      console.log(this.$route.params)
      this.getAppInfo(this.$route.params.id)

      console.log(this.appVersionInfo)
      console.log(this.appBaseData)
      // 判断是否是手机设备
      if (this.isIos || this.isAndroid) {
        this.showQRCode = false
      } else {
        this.showQRCode = true
      }
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
        return `${this.axios.defaults.baseURL}${this.appBaseData.icon}`
      },
      clickDownLoadBtn() {
        if (this.isIos) {
          const a = document.createElement('a')
          a.setAttribute('href', `itms-services://?action=download-manifest&url=${this.appVersionInfo.downloadUrl}/plist/${this.appBaseData.appName}`)
          a.click()
        } else {
          const a = document.createElement('a')
          a.setAttribute('href', this.downloadUrl)
          a.click()
        }
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
    width: 50%;
    height: 100%;
    max-width: 800px;
    text-align: center;
    position: absolute;
    font-size: 0px;
  }

  .preview-middlewrapper-mobile {
    margin-top: 0px;
    margin-left: 25%;
    width: 50%;
    height: 100%;
    max-width: 800px;
    text-align: center;
    position: absolute;
    font-size: 0px;
  }

  .preview-middlewrapper .left {
    display: inline-block;
    width: 50%;
    height: 100%;
    vertical-align: top;
    text-align: left;
  }
  .preview-mobilewrapper {
    display: inline-block;
    width: 50%;
    height: 100%;
    vertical-align: top;
    position: relative;
    text-align: center;
  }

  .preview-mobilewrapper > img {
    margin-top: 120px;
    width: 300px;
    /*min-width: 300px;*/
    position: absolute;
    left: 0px;
    height: auto;
  }

  .preview-middlewrapper .appicon {
    width: 126px;
    height: 126px;
    border-radius: 15px;
    margin-top: 160px;
  }
  .preview-middlewrapper .title {
    color: #354052;
    font-weight: bold;
    font-size: 26px;
    height: 37px;
    line-height: 37px;
    margin-top: 33px;
  }
  .preview-middlewrapper .info {
    display: flex;
    flex-direction: row;
    color: #242A34;
    font-size: 14px;
    line-height: 20px;
    margin-top: 12px;
    opacity: 0.5;
  }
  .preview-middlewrapper .desc {
    margin-right: 12px;
  }
  .preview-middlewrapper .date {
    color: #242A34;
    font-size: 14px;
    text-align: left;
    line-height: 20px;
    margin-top: 2px;
    opacity: 0.5;
  }
  .preview-middlewrapper .downloadBtn{
    background-color: #8393F5;
    width: 70%;
    height: 44px;
    color: white;
    font-size: 14px;
    margin-top: 16px;
    border-color: transparent;
  }
  .downloadBtn i:before {
    color: white;
  }
  /*.preview-mobilewrapper .mobieImg {*/
    /*width: 470px;*/
    /*height: 70%;*/
    /*top: 0px;*/
    /*left: 0px;*/
    /*position: absolute;*/
    /*background-size: cover;*/
    /*margin-top: 25%;*/
  /*}*/
  .preview-mobilewrapper .qrcodeImg img{
    position: absolute;
    width: 150px;
    height: auto;
    left: 32px;
    margin-top: 200px;
  }

  .preview-mobilewrapper .codetips {
    color: #354052;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    height: 20px;
    left: 35px;
    top: 380px;
    position: absolute;
  }
  .preview-mobilewrapper .platform {
    color: #354052;
    opacity: 0.5;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    height: 20px;
    left: 60px;
    top: 400px;
    position: absolute;
  }

</style>
