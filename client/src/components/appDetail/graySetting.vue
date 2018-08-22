<template>
  <div class="graySetting-wrapper" @click="cancel">
    <transition name="fadeRight">
      <div v-show="this.show" class="graySetting-content" @click.stop="clickcontent">
        <div class="top">
          <i class="icon-ic_editor"></i>
          <span>设置灰度版本-更新策略</span>
        </div>
        <el-form label-position="left" label-width="100px">
          <el-form-item label="选择版本号">
            <div class="chooseVersion" @click.stop="showVersions">
              <p class="nowrap" v-html="getCodeStr()"></p>
              <i class="el-icon-arrow-down"></i>
            </div>
            <div class="versionlistwrapper" v-show="this.showVersionList">
              <ul class="list">
                <li class="item" v-for="(item, index) in versionList" :key="index" @click="chooseVersion(item)" v-html="getListCodeStr(item)"></li>
              </ul>
            </div>
          </el-form-item>
          <el-form-item label="更新方式">
            <el-radio v-model="updateType" label="normal">普通更新</el-radio>
            <el-radio v-model="updateType" label="silent">静默更新</el-radio>
            <el-radio v-model="updateType" label="force">强制更新</el-radio>
          </el-form-item>
          <el-form-item label="下载次数限制">
            <el-radio v-model="downloadCount" label="不限制">不限制</el-radio>
            <el-radio v-model="downloadCount" label="限">限</el-radio>
            <input v-model="downloadNuber" type="text" style="width: 72px;border-bottom: solid 1px #eee;text-align: center">
            <p style="display: inline-block;color: #354052">次</p>
          </el-form-item>
          <el-form-item label="ip地址限制">
            <el-radio v-model="iplimit" label="black">黑名单</el-radio>
            <el-radio v-model="iplimit" label="white">白名单</el-radio>
          </el-form-item>
          <el-form-item label="">
            <div class="listerapper">
              <p>名单明细</p>
              <ul class="ipweapper">
                <li class="ipitem" v-for="(item, index) in this.ipList" :key="index">
                  <p v-html="item"></p>
                  <i class="el-icon-close" @click="removeIp(index)"></i>
                </li>
              </ul>
              <div class="footwrapper">
                <input @keyup.enter="addIpAdress" v-model="addip" type="text" placeholder="回车确认并添加">
                <input type="text" style="opacity: 0">
              </div>
            </div>
          </el-form-item>
        </el-form>

        <el-button round class="elbutton-style sureBtn" @click="sure">确认</el-button>
        <el-button round class="elbutton-style cancelBtn" @click="cancel">取消</el-button>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import {getUserTeam} from '../../mgr/userMgr'

  export default {
    props: {
      versionList: {
        type: Array
      },
      appInfo: {
        type: Object
      }
    },
    data() {
      return {
        show: false,
        updateType: '',
        downloadCount: '',
        downloadNuber: '',
        iplimit: '',
        showinDownLoadPage: false,
        showVersionList: false,
        ipList: [],
        addip: '',
        currentVersion: {}
      }
    },
    created() {
      setTimeout(() => {
        this.show = true

        let ind = 0
        this.versionList.forEach((item, index) => {
          if (this.appInfo.grayReleaseVersionId && this.appInfo.grayReleaseVersionId === item._id) {
            ind = index
          }
        })
        this.currentVersion = this.versionList[ind]
        console.log(this.currentVersion)
        console.log(this.appInfo)

        this.setupData()

      }, 200)
    },
    methods: {
      // 设置初始值
      setupData() {
        this.updateType = this.appInfo.grayStrategy.updateMode || ''
        if (!this.appInfo.grayStrategy.downloadCountLimit || this.appInfo.grayStrategy.downloadCountLimit === 0) {
          this.downloadCount = '不限制'
        } else {
          this.downloadCount = '限'
          this.downloadNuber = this.currentVersion.downloadCount
        }
        this.iplimit = this.appInfo.grayStrategy.ipType
        let tempArr = []
        if (this.appInfo.grayStrategy.ipList.length > 0) {
          this.appInfo.grayStrategy.ipList.forEach((item) => {
            tempArr.push(item)
          })
        }
        this.ipList = tempArr
      },
      cancel() {
        this.show = false
        setTimeout(() => {
          this.$emit('cancel')
        }, 500)
      },
      sure() {
        var number = 0
        if (this.downloadCount === '0') {
          number = 0
        } else {
          number = this.downloadNuber
        }
        let body = {
          'strategy': {
            // 更新模式  force / silent / normal/ 强制或者静默或者普通升级
            'updateMode': this.updateType,
            'ipType': this.iplimit,
            // default:'black',enum:['black','white']
            'ipList': this.ipList,
            // default 0 表示不现在下载次数
            'downloadCountLimit': number
          },
          'version': {
            'versionId': this.currentVersion._id,
            'versionCode': this.currentVersion.versionCode,
            'release': true
          }
        }
        AppResourceApi.grayVersion(getUserTeam()._id, this.appInfo._id, body).then((res) => {
          console.log(res)
          this.$message.success(res.message)
          this.$emit('graySettingSuccess')
        }, reject => {

        })
      },
      clickcontent() {
        this.showVersionList = false
      },
      showVersions() {
        this.showVersionList = !this.showVersionList
      },
      addIpAdress() {
        this.ipList.push(this.addip)
        this.addip = ''
      },
      removeIp(index) {
        this.ipList.splice(index, 1)
      },
      chooseVersion(item) {
        this.currentVersion = item
        this.showVersionList = false
        this.setupData()
      },
      getCodeStr() {
        return `${this.currentVersion.versionStr}(${this.currentVersion.versionCode})`
      },
      getListCodeStr(item) {
        return `${item.versionStr}(${item.versionCode})`
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .fadeRight-enter-active {
    transition: all .5s ease;
  }
  .fadeRight-leave-active {
    transition: all .5s ease;
  }
  .fadeRight-enter, .fadeRight-leave-to {
    transform: translateX(100%);
  }
  .graySetting-wrapper {
    position: absolute;
    top: 72px;
    left: 0px;
    bottom: 0px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 100;
  }
  .graySetting-content {
    float: right;
    width: 480px;
    height: 100%;
    margin-right: 0;
    background-color: white;
    box-shadow: 0 2px 6px rgba(120, 120, 120, 0.5);
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .graySetting-content .top {
    padding-left: 40px;
    padding-top: 22px;
    position: relative;
  }
  .graySetting-content .top span {
    color: $mainTitleColor;
    font-size: 14px;
    line-height: 24px;
    margin-left: 8px;
  }
  .graySetting-content .el-form {
    margin-top: 24px;
    margin-left: 48px;
  }
  .graySetting-content .chooseVersion {
    width: 180px;
    height: 24px;
    font-size: 12px;
    color: $subTitleColor;
    border: solid 1px #eeeeee;
    margin-top: 8px;
    position: relative;
    box-sizing: border-box;
  }
  .graySetting-content .chooseVersion p {
    line-height: 24px;
    margin-left: 10px;
  }
  .graySetting-content .chooseVersion i {
    position: absolute;
    top: 0px;
    right: 0px;
    line-height: 24px;
  }
  .graySetting-content .versionlistwrapper {
    position: absolute;
    z-index: 200;
    width: 180px;
    background-color: rgba(255,255,255,0.9);
    max-height: 200px;
    padding-left: 10px;
    box-sizing: border-box;
    overflow: scroll;
    border-left: solid 1px #eee;
    border-bottom: solid 1px #eee;
    border-right: solid 1px #eee;
  }
  .graySetting-content .versionlistwrapper .list {
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .graySetting-content .versionlistwrapper .item {
    height: 24px;
    line-height: 24px;
    border-bottom: solid 1px #eee;
    font-size: 12px;
    color: $subTitleColor;
  }
  .graySetting-content .el-form .el-form-item {
    margin-bottom: 5px;
  }
  .graySetting-content .el-form .el-form-item label {
    font-size: 14px;
    color: $subTitleColor;
  }
  .graySetting-content .el-radio__label {
    color: $mainTitleColor;
  }
  .graySetting-content .el-radio__input.is-checked .el-radio__inner {
    background-color: $mainColor;
    border-color: $mainColor;
  }
  .graySetting-content .el-radio__input.is-checked + .el-radio__label {
    color: $mainColor;
  }
  .graySetting-content .listerapper {
    width: 253px;
    font-size: 12px;
    color: $mainTitleColor;
  }
  .graySetting-content .listerapper input {
    width: 240px;
    height: 24px;
    border-width: 0px;
    border-bottom: solid 1px #eee;
  }
  .graySetting-content .listerapper .ipitem {
    position: relative;
  }
  .graySetting-content .listerapper .ipitem p {
    width: 240px;
    height: 35px;
    line-height: 35px;
    border-bottom: solid 1px #eee;
  }
  .graySetting-content .listerapper .ipitem i {
    position: absolute;
    top: 0px;
    right: 0px;
    line-height: 35px;
  }
  .graySetting-content .listerapper .footwrapper {
    position: relative;
  }
  .graySetting-content .listerapper .footwrapper i {
    position: absolute;
    top: 0px;
    right: 0px;
    line-height: 24px;
  }
  .graySetting-content .el-button {
    margin-top: 48px;
    margin-bottom: 100px;
  }
  .graySetting-content .el-button span {
    line-height: 36px !important;
  }
  .graySetting-content .sureBtn {
    background-color: $mainColor !important;
    color: white !important;
    margin-left: calc(100% - 72px - 96px - 96px - 10px);
  }
</style>
