<template>
  <div class="editorVersion-wrapper" @click="cancel">
    <transition name="fadeRight">
      <div v-show="this.show" class="editorVersion-content" @click.stop="clickcontent">
        <div class="top">
          <i class="icon-ic_editor"></i>
          <span>版本编辑</span>
          <el-switch
            v-model="showinDownLoadPage"
            active-color="#6477F2"
            inactive-color="#333">
          </el-switch>
          <p>显示到下载页</p>
        </div>
        <el-form label-position="left">
          <el-form-item label="版本名称">
            <p class="versioninput">{{this.versionInfo.appName}}</p>
          </el-form-item>
          <el-form-item label="文件大小">
            <p class="versioninput">{{(this.versionInfo.size / 1024 / 1024).toFixed(2)}}M</p>
          </el-form-item>
          <el-form-item label="下载次数">
            <p class="versiondownload" style="display: inline-block" v-html="getDownLoadCount(this.versionInfo.downloadCount)"></p>/<span style="color: #9B9B9B;display: inline-block" v-html="getAllowDownLoadCount(this.versionInfo.strategy)"></span>
          </el-form-item>
          <el-form-item label="更新日志">
            <p class="textareacount">{{this.updataContent.length}}/100</p>
            <el-input
              class="editorVersion-updatatextarea"
              type="textarea"
              placeholder="更新日志"
              :maxlength="100"
              v-model="updataContent">
            </el-input>
          </el-form-item>
        </el-form>

        <el-button round class="sureBtn" @click="sure">确认</el-button>
        <el-button round class="cancelBtn" @click="cancel">取消</el-button>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      versionInfo: {
        type: Object
      }
    },
    data() {
      return {
        show: false,
        updataContent: '',
        showinDownLoadPage: false
      }
    },
    created() {
      setTimeout(() => {
        this.show = true
      }, 200)
    },
    methods: {
      cancel() {
        this.$emit('cancel')
      },
      sure() {

      },
      clickcontent() {

      },
      getDownLoadCount(count) {
        if (count) {
          return count
        } else {
          return 0
        }
      },
      getAllowDownLoadCount(strategy) {
        if (strategy.downloadCountLimit) {
          return strategy.downloadCountLimit
        } else {
          return '不限'
        }
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
  .editorVersion-wrapper {
    position: absolute;
    top: 72px;
    left: 0px;
    bottom: 0px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 100;
  }
  .editorVersion-content {
    float: right;
    width: 33%;
    height: 100%;
    margin-right: 0;
    background-color: white;
    box-shadow: 0 2px 6px rgba(120, 120, 120, 0.5);
  }
  .editorVersion-content .top {
    padding-left: 41px;
    padding-top: 22px;
    position: relative;
  }
  .editorVersion-content .top span {
    color: $mainTitleColor;
    font-size: 14px;
    line-height: 24px;
  }
  .editorVersion-content .top p {
    position: absolute;
    top: 22px;
    right: 24px;
    font-size: 12px;
    color: #354052;
    line-height: 24px;
  }
  .editorVersion-content .top .el-switch {
    position: absolute;
    right: 104px;
    top: 24px;
  }
  .editorVersion-content .el-form {
    margin-top: 24px;
    margin-left: 72px;
  }
  .editorVersion-content .el-form .el-form-item {
    margin-bottom: 5px;
  }
  .editorVersion-content .el-form .el-form-item label {
    font-size: 12px;
    color: $subTitleColor;
  }
  .editorVersion-content .el-form .el-form-item .versioninput {
    width: calc(100% - 72px - 24px);
    font-size: 12px;
    color: $mainTitleColor;
  }
  .editorVersion-content .el-form .el-form-item .versiondownload {
    font-size: 12px;
    color: $mainTitleColor;
  }
  .editorVersion-content .el-form .el-form-item .textareacount {
    text-align: right;
    padding-right: 72px;
  }
  .editorVersion-content .editorVersion-updatatextarea {
    width: calc(100% - 72px);
    font-size: 12px;
    color: $mainTitleColor;
  }
  .editorVersion-content .editorVersion-updatatextarea textarea {
    height: 168px !important;
    outline: 0;
    padding-left: 5px;
  }
  .editorVersion-content .el-button {
    width: 96px !important;
    height: 36px !important;
    border: solid 1px $mainColor !important;
    color: $mainColor !important;
    background-color: white !important;
    font-size: 12px;
    margin-top: 48px;
    padding: 0px;
  }
  .editorVersion-content .el-button span {
    line-height: 36px !important;
  }
  .editorVersion-content .sureBtn {
    background-color: $mainColor !important;
    color: white !important;
    margin-left: calc(100% - 72px - 96px - 96px - 10px);
  }
</style>
