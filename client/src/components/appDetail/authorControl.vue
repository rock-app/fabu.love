<template>
  <div class="authorControll-wrapper">
    <el-form ref="form" labelWidth="200px" label-position="left">
      <el-form-item class="authorControll-form" label="下载页面对所有人可见">
        <el-switch
          style="margin-left: 170px"
          v-model="allCanSeeDownLoadPage"
          active-color="#F8BA0B"
          inactive-color="#333">
        </el-switch>
      </el-form-item>
      <el-form-item class="authorControll-form" label="开启密码访问">
        <el-switch
          style="margin-left: 170px"
          v-model="visitPassword"
          active-color="#F8BA0B"
          inactive-color="#333">
        </el-switch>
        <input v-show="this.visitPassword" class="authorControll-passwordInput" placeholder="输入密码"/>
        <span v-show="this.visitPassword" class="authorControll-passwordInput-arrow"></span>
      </el-form-item>
      <hr style="opacity: 0.2;margin-top: 40px;margin-bottom: 40px">
      <el-form-item class="authorControll-form" label="自动刷新应用权限">
        <el-switch
          style="margin-left: 170px;"
          v-model="autoRefresh"
          active-color="#F8BA0B"
          inactive-color="#333">
        </el-switch>
      </el-form-item>
      <hr style="opacity: 0.1">
      <el-form-item class="authorControll-invite" label="成员列表" style="margin-top: 50px">
        <el-button class="authorControll-delectbtn" round @click="clickInviteBtn">邀请成员</el-button>
      </el-form-item>
    </el-form>
    <inviteMember @clickWrapper="hiddenInviteView()" v-show="showInviteView"></inviteMember>
  </div>
</template>

<script type="text/ecmascript-6">
  import InviteMember from './inviteMember.vue'

  export default {
    data() {
      return {
        allCanSeeDownLoadPage: false,
        visitPassword: true,
        showInviteView: false,
        autoRefresh: false
      }
    },
    components: {
      InviteMember
    },
    created () {
      this.$watch('allCanSeeDownLoadPage', () => {
        console.log(this.allCanSeeDownLoadPage)
      })
      this.$watch('visitPassword', () => {
        console.log(this.visitPassword)
      })
      this.$watch('autoRefresh', () => {
        console.log(this.autoRefresh)
      })
    },
    methods: {
      clickInviteBtn() {
        this.showInviteView = true
      },
      hiddenInviteView() {
        this.showInviteView = false
      }
    }
  }

</script>

<style lang="scss">
  @import "../../common/scss/base";

  .authorControll-wrapper {
    padding: 80px 15%;
  }
  .authorControll-form {
    margin-bottom: 40px;
  }
  .authorControll-delectbtn {
    margin-left: -40px;
    background-color: $paleGrey !important;
    border-color: #1AA79A;
    color: #1AA79A;
    height: 30px;
    vertical-align: middle;
    padding-top: 0px !important;
  }
  .authorControll-delectbtn span {
    margin-top: 0px !important;
    line-height: 30px;
    height: 30px;
  }
  .authorControll-invite .el-form-item__label {
    font-size: 20px;
    color: #666;
  }
  .authorControll-passwordInput {
    margin-left: 60px;
    width: 200px;
    outline: 0;
    height: 40px;
    border-radius: 5px;
    border: solid 1px #333;
    display: inline-block;
    padding-left: 10px;
  }
  .authorControll-passwordInput-arrow {
    position: relative;
    display: inline-block;
    width: 14px;
    height: 14px;
    left: -223px;
    background-color: white;
    transform: rotate(-45deg);
    border-top: solid 1px #333;
    border-left: solid 1px #333;
    box-sizing: border-box;
  }
</style>
