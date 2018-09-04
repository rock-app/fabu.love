<template>
  <div class="appsetting-wrapper">
    <div class="top">
      <i class="el-icon-setting"></i>  设置
    </div>
    <div class="content">
      <el-form labelWidth="150px" label-position="left">
        <el-form-item label="应用短链接">
          {{this.axios.defaults.baseURL}}<el-input v-model="appInfo.shortUrl" class="shorturl"></el-input>
        </el-form-item>
        <el-form-item label="安装方式">
          <el-radio v-model="installType" label="公开">公开</el-radio>
          <el-radio v-model="installType" label="密码安装">密码安装</el-radio>
          <el-input v-show="installType === '密码安装'" v-model="installPwd" type="password" class="installtype" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="新版本内测发布方式">
          <el-radio v-model="pulishType" label="手动发布">手动发布</el-radio>
          <el-radio v-model="pulishType" label="自动发布">上传新版本后自动立即发布</el-radio>
        </el-form-item>
      </el-form>

      <button type="button" class="bottomBtn button-style-border" @click="clickSure">立即生效</button>
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
      }
    },
    data() {
      return {
        installType: '公开',
        pulishType: '手动发布',
        installPwd: ''
      }
    },
    created() {
    },
    mounted() {
      this.installType = this.appInfo.installWithPwd === 1 ? '密码安装' : '公开'
      this.pulishType = this.appInfo.autoPublish === true ? '自动发布' : '手动发布'
      this.installPwd = this.appInfo.installPwd
    },
    methods: {
      clickSure() {
        if (this.installType === '密码安装' && this.installPwd === '') {
            this.$message.error('密码不能为空')
            return
        }
        let body = {
          'shortUrl': this.appInfo.shortUrl,
          'installWithPwd': this.installType === '公开' ? 0 : 1,
          'installPwd': this.installPwd,
          'autoPublish': this.pulishType === '手动发布' ? 0 : 1
        }
        AppResourceApi.updateAppSetting(getUserTeam()._id, this.appInfo._id, body).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
            }
        }, reject => {

        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .appsetting-wrapper .top {
    width: 100%;
    height: 48px;
    background-color: white;
    margin-top: 12px;
    line-height: 48px;
    padding-left: 24px;
    box-sizing: border-box;
  }
  .appsetting-wrapper .content {
    width: 100%;
    height: 276px;
    background-color: white;
    margin-top: 1px;
    padding-top: 35px;
  }
  .appsetting-wrapper .content .el-form {
    margin-left: 120px;
  }
  .appsetting-wrapper .content .el-form .el-form-item label {
    font-size: 14px;
    color: $subTitleColor;
    margin-right: 20px;
  }
  .appsetting-wrapper .content .el-form .el-form-item .el-input__inner {
    border-right-width: 0px;
    border-left-width: 0px;
    border-top-width: 0px;
    border-radius: 0px;
    font-size: 14px;
    outline: 0;
    padding: 0px;
    padding-left: 5px;
    height: 24px !important;
    line-height: 24px;
  }
  .appsetting-wrapper .content .el-form .el-form-item .shorturl {
    width: 150px;
    display: inline-block;
  }
  .appsetting-wrapper .content .el-form .el-form-item .installtype {
    width: 150px;
  }
  .content .bottomBtn{
    width: 96px;
    height: 36px;
    border-radius: 18px;
    line-height: 36px;
    margin-top: 18px;
    margin-left: calc(50% - 48px);
  }
  .appsetting-wrapper .content .el-form .el-form-item .el-radio span {
    font-size: 14px !important;
  }
  .appsetting-wrapper .content .el-radio__input.is-checked .el-radio__inner {
    background-color: $mainColor;
    border-color: $mainColor;
  }
  .appsetting-wrapper .content .el-radio__input.is-checked + .el-radio__label {
    color: $mainColor;
  }
</style>
