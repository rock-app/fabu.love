<template xmlns:v-popover="">
  <div class="headernav-wrapper">
    <div class="leftWrapper">
      <!--团队，切换团队-->
      <div class="team" v-show="isTeam">
        <el-popover ref="popover" placement="bottom" width="160" trigger="click">
          <ul>
            <li class="leftWrapper-item" v-for="(item, index) in this.teamArr" :key="index" @click="changeTeam(item)">
              {{item.name}}
            </li>
          </ul>
        </el-popover>
        <el-button v-popover:popover @click="clickTeamBtn">{{this.currentTeam.name}}  <i class="el-icon-arrow-down"></i></el-button>
      </div>
      <!--详情-->
      <div class="detail" v-show="!isTeam">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/apps' }">应用列表</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.appName}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="rightWrapper">
      <el-badge is-dot class="item" :hidden="this.redDocHidden">
        <i class="icon-ic_notice" @click="clickMessage"></i>
      </el-badge>
      <div class="userwrapper" @click="clickUserIcon" @mouseover="userInfoHovered" @mouseout="userInfoUnhovered">
        <img src="../../assets/ic_touxiang.png" alt="" class="userIcon">
        <p class="nowrap">{{this.userInfo.userName}}</p>
      </div>

      <ul class="userInfoSubWrapper" v-show="this.userHover" @mouseover="userInfoHovered" @mouseout="userInfoUnhovered">
        <li class="userInfoSub" @click="clickUserInfoWrapper">
          <span>个人设置</span>
        </li>
        <li class="userInfoSub" @click="dialogFormVisible = true">
          <span>创建团队</span>
        </li>
        <li class="userInfoSub" @click="loginout">
          <span>退出</span>
        </li>
      </ul>
    </div>

    <el-dialog title="创建团队" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="团队名称">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getUserInfo, removeUserInfo, getUserTeam, saveUserTeam} from '../../mgr/userMgr'
  import Bus from '../../common/js/bus'
  import TokenMgr from '../../mgr/TokenMgr'
  import * as UserApi from '../../api/moudle/userApi'

  export default {
    data() {
      return {
        userInfo: {},
        userHover: false,
        redDocHidden: true,
        currentTeam: {},
        isTeam: true,
        appName: '',
        dialogFormVisible: false,
        form: {
          'name': ''
        },
        teamArr: []
      }
    },
    created() {
      Bus.$on('applist', () => {
        this.isTeam = true
      })
      Bus.$on('appdetail', (appName) => {
        this.isTeam = false
        this.appName = appName
      })

      this.userInfo = getUserInfo()
      this.currentTeam = getUserTeam()
      this.teamArr = this.userInfo.teamId
      this.loadMessage()
    },
    methods: {
      clickUserIcon() {
        this.userHover = true
      },
      userInfoHovered() {
        this.userHover = true
      },
      userInfoUnhovered() {
        this.userHover = false
      },
      clickUserInfoWrapper() {
        this.userHover = false
        Bus.$emit('showUserInfo')
      },
      loginout() {
        TokenMgr.clearTokens()
        removeUserInfo()
        this.$router.push('/login')
      },
      clickMessage() {
        Bus.$emit('showUserMessage')
      },
      loadMessage() {
        UserApi.getMessageCount().then((res) => {
          if (res.data.unread > 0) {
            this.redDocHidden = false
          } else {
            this.redDocHidden = true
          }
        }, reject => {

        })
      },
      changeTeam(item) {
        // 更新当前团队
        saveUserTeam(item)
        // 刷新app列表
        Bus.$emit('refreshList')
        // 更新team
        this.currentTeam = getUserTeam()
      },
      sure() {
        if (this.form.name.length === 0) {
          this.$message.error('请输入团队名称')
          return
        }
        UserApi.createdTeam(this.form.name).then((res) => {
          this.$message.success('创建成功')
        }, reject => {

        })
        this.dialogFormVisible = false
      },
      clickTeamBtn() {
        // 获取我的团队列表
        UserApi.getUserTeams().then((res) => {
          this.teamArr = res.data.teams
        }, reject => {

        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";
  .headernav-wrapper {
  }
  .headernav-wrapper .leftWrapper {
    float: left;
    display: flex;
    flex-direction: row;
  }
  .leftWrapper-item {
    height: 44px;
    line-height: 44px;
    border-bottom: solid 1px #eee;
    box-sizing: border-box;
  }
  .headernav-wrapper .leftWrapper .team .el-button {
    margin-top: 15px;
    font-size: 20px;
    font-family: "PingFang SC";
    color: $mainTitleColor;
    border-color: transparent;
    max-width: 300px;
  }
  .headernav-wrapper .leftWrapper .el-breadcrumb {
    height: 72px;
    line-height: 72px;
    font-family: "PingFang SC";
    font-size: 20px;
    color: $mainTitleColor;
  }
  .headernav-wrapper .rightWrapper {
    float: right;
    height: 72px;
    margin-right: 0px;
    margin-top: 0px;
    text-align: right;
    position: relative;
    font-size: 0px;
  }
  .headernav-wrapper .rightWrapper .userwrapper {
    display: inline-block;
    height: 100%;
  }
  .headernav-wrapper .rightWrapper .userwrapper:hover {
    background-color: $paleGrey;
    border: solid 1px #eee;
    box-sizing: border-box;
  }
  .headernav-wrapper .rightWrapper .userInfoSubWrapper {
    position: absolute;
    left: 27px;
    top: 72px;
    right: 0px;
    z-index: 100;
    border-left: solid 1px #eee;
    border-right: solid 1px #eee;
    box-sizing: border-box;
  }
  .headernav-wrapper .rightWrapper .item {
    display: inline-block;
    vertical-align: middle;
    margin-top: 18px;
    width: 15px;
    margin-right: 12px;
  }
  .headernav-wrapper .rightWrapper i {
    font-size: 18px;
  }
  .headernav-wrapper .rightWrapper p {
    display: inline-block;
    vertical-align: middle;
    line-height: 24px;
    height: 24px;
    margin-top: 24px;
    font-size: 14px;
    color: $mainTitleColor;
    max-width: 160px;
    margin-right: 48px;
    margin-left: 5px;
  }
  .headernav-wrapper .rightWrapper .userIcon {
    margin-left: 12px;
    vertical-align: middle;
    margin-top: 20px;
  }
  .headernav-wrapper .rightWrapper .userInfoSub {
    width: 100%;
    height: 44px;
    text-align: center;
    line-height: 44px;
    background-color: white;
    border-bottom: solid 1px #eee;
    box-sizing: border-box;
    font-size: 14px;
  }
</style>
