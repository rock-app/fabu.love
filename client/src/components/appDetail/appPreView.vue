

<template>
    <div class="previewapp-wrapper">
      <!--中间-->
      <div :class="getContentClass()" v-if="this.appBaseData">
        <div :class="getLeftClass()">
          <!--手机上查看-->
          <div v-show="isPhone">
            <p>手机</p>
            <phoneWrapper
              :appBaseData="appBaseData"
              :appVersionInfo="appVersionInfo"
              :platformStr="platformStr"
              @clickDownLoadBtn="clickDownLoadBtn"
            ></phoneWrapper>
          </div>


          <!--pc上查看-->
          <div class="pcWrapper" v-show="!isPhone">
            <p>33333333</p>
            <img class="appicon" :src="getIconUrl()" alt="">
            <p class="title">{{this.appBaseData.appName}}</p>
            <div class="info">
              <p v-if="this.appVersionInfo.versionStr" class="desc">版本：{{this.appVersionInfo.versionStr}}</p><span>大小：{{(this.appVersionInfo.size/1024/1024).toFixed(1)}}M</span>
            </div>
            <p class="date">发布日期： {{ this.appVersionInfo.creatDateStr }} </p>
            <div v-if="showPasswordInput">
              <el-input v-model="pwd" type="password" placeholder="请输入密码" class="pwd"></el-input>
              <el-button @click="clickSure" type="primary" round class="downloadBtn">确定</el-button>
            </div>

            <el-button v-if="showDownLoadBtn" @click="clickDownLoadBtn" class="downloadBtn" type="primary" round><i :class="this.platformStr === 'ios' ? 'icon-ic_ios':'icon-ic_andr'"></i>    下载安装</el-button>
          </div>
        </div>


        <!--右侧二维码-->
        <div class="preview-mobilewrapper" v-show="!isPhone">
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
  import PhoneWrapper from './phoneWrapper.vue'

  export default {
    components: {
      VueQr, PhoneWrapper
    },
    data() {
      return {
        versionArr: [],
        appVersionInfo: {},
        appBaseData: null,
        downloadUrl: '',
        platformStr: '',
        pwd: '',
        isPhone: false
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
      },
      showDownLoadBtn() { // mac端不显示，密码安装且密码不正确时不显示
        var p = navigator.platform
        if (p.indexOf('Mac') === 0) {
          return false
        } else {
          if (this.appBaseData.installWithPwd !== 1 || this.pwd === this.appBaseData.installPwd) {
            return true
          } else {
            return false
          }
        }

      },
      showPasswordInput() {
          if (this.appBaseData.installWithPwd === 1 && this.pwd !== this.appBaseData.installPwd) { // 密码安装,且密码不对的情况下展示，其他情况都隐藏
              return true
          }
      }
    },
    mounted() {
      this.getAppInfo(this.$route.params.id)

      // 判断是否是手机设备
      if (this.isIos || this.isAndroid) {
        this.isPhone = true
      } else {
        this.isPhone = false
      }
    },
    created() {
      this.$nextTick(() => {
      })

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
          if (res.data.version === null) {
              this.$message.error('未检测到版本信息')
              return
          }
          this.appVersionInfo = res.data.version
          this.appBaseData = res.data.app
          let releaseDate = new Date(this.appVersionInfo.uploadAt)
          this.downloadUrl = `${window.origin}${this.$route.fullPath}`
          this.platformStr = res.data.app.platform
          this.appVersionInfo.creatDateStr = `${releaseDate.getFullYear()}-${releaseDate.getMonth() + 1}-${releaseDate.getDate()}`
          if (this.appBaseData.installPwd === 1) {
            this.installWithPwd = true
          } else {
            this.installWithPwd = false
          }

        }, reject => {
          this.$message.error('服务器错误')
        })
      },
      getIconUrl() {
        return `${this.axios.defaults.baseURL}${this.appBaseData.icon}`
      },
      clickDownLoadBtn() {
        if (this.isIos) {
          const a = document.createElement('a')
//            `itms-services://?action=download-manifest&url=${this.axios.defaults.baseURL}api/plist/${this.appBaseData._id}/${this.appVersionInfo._id}`
          a.setAttribute('href', this.appVersionInfo.installUrl)
          a.click()
        } else {
          const a = document.createElement('a')
          let url = `${this.axios.defaults.baseURL}${this.appVersionInfo.downloadUrl}`
          a.setAttribute('href', url)
          a.click()
          let _this = this
          fetch(url).then(response => {
            var reader = response.body.getReader()
            var headers = response.headers
            var totalLength = headers.get('Content-Length')
            var bytesReceived = 0
            reader.read().then(function processResult(result) {
              if (result.done) {
                console.log('下载完成')
                console.log(_this.appBaseData)
                AppResourceApi.downloadedCount(_this.appBaseData._id, _this.appVersionInfo._id).then(() => {
                }, reject => {

                })
                return
              }
              bytesReceived += result.value.length
              console.log(`progress: ${bytesReceived / totalLength * 100}%`)
              return reader.read().then(processResult)
            })
          })
        }
      },
      getContentClass() {
        // 判断是否是手机设备
        if (this.isPhone) {
          return 'preview-middlewrapper-forPhone'
        } else {
          return 'preview-middlewrapper'
        }
      },
      getLeftClass() {
        if (this.isPhone) {
          return 'left-forPhone'
        } else {
          return 'left'
        }
      },
      clickSure() {
        if (this.pwd !== this.appBaseData.installPwd) {
          this.$message.error('密码错误')
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
  /*网页样式*/
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
    position: absolute;
    left: 0px;
    height: auto;
  }

  .pcWrapper .appicon {
    width: 126px;
    height: 126px;
    border-radius: 15px;
    margin-top: 160px;
  }
  .previewapp-wrapper .title {
    color: #354052;
    font-weight: bold;
    font-size: 26px;
    height: 37px;
    line-height: 37px;
    margin-top: 33px;
  }
  .pcWrapper .info {
    display: flex;
    flex-direction: row;
    color: #242A34;
    font-size: 14px;
    line-height: 20px;
    margin-top: 12px;
    opacity: 0.5;
  }
  .previewapp-wrapper .desc {
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
  .preview-middlewrapper .pwd {
    width: 70%;
    height: 40px;
    border-radius: 6px;
    margin-top: 12px;
    background-color: transparent;
    color: red;
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

  /*手机样式*/
  .preview-middlewrapper-forPhone {
    margin-top: 0px;
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    font-size: 0px;
  }
  .preview-middlewrapper-forPhone .left-forPhone {
    display: inline-block;
    width: 100%;
    height: 100%;
    vertical-align: top;
    text-align: center;
  }
</style>
