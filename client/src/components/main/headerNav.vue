<template xmlns:v-popover="">
  <div class="headernav-wrapper">
    <div class="leftWrapper">
      <!--团队，切换团队-->
      <div class="team">
        <el-popover
          ref="popover"
          placement="bottom-start"
          width="220"
          left="200"
          @show="popovershow"
          @hide="popoverhide"
          trigger="click"
          :disabled="!this.isAppList || teamArr.length === 0"
          :visible-arrow="false">
          <ul>
            <li class="leftWrapper-item" v-for="(item, index) in this.teamArr" :key="index" @click="changeTeam(item)">
              <p>
                {{item.name}}
              </p>
            </li>
          </ul>
        </el-popover>
        <el-button class="teamBtn" v-popover:popover @click="clickTeamBtn">{{this.currentTeam.name}}  <i class="el-icon-arrow-down" ref="arrow"></i></el-button>

        <el-button class="flagBtn" @click="clickFlagBtn" v-show="!isAppList"></el-button>
      </div>
      <!--详情-->
      <div class="detail" v-show="!isAppList">
        <p>{{this.appName}}</p>
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
        <li class="userInfoSub" @click="loginout">
          <span>退出</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getUserInfo, removeUserInfo, getUserTeam, saveUserTeam, updateTeamArr } from '../../mgr/userMgr'
  import TokenMgr from '../../mgr/TokenMgr'
  import * as UserApi from '../../api/moudle/userApi'

  export default {
    data() {
      return {
        userInfo: {},
        userHover: false,
        redDocHidden: true,
        currentTeam: {},
        isAppList: true,
        appName: '',
        dialogFormVisible: false,
        form: {
          'name': ''
        },
        teamArr: []
      }
    },
    mounted() {
      this.bus.$on('applist', () => {
        this.isAppList = true
        this.$refs.arrow.style.transform = `rotate(0deg)`
      })
      this.bus.$on('miniApplist', () => {
        this.isAppList = true
        this.$refs.arrow.style.transform = `rotate(0deg)`
      })

      this.bus.$on('appdetail', (appName) => {
        this.isAppList = false
        this.appName = appName
        this.$refs.arrow.style.transform = `rotate(-90deg)`
      })
      this.bus.$on('miniAppDetail', (appName) => {
        this.isAppList = false
        this.appName = appName
        this.$refs.arrow.style.transform = `rotate(-90deg)`
      })
      this.bus.$on('allreadMessage', () => {
        this.redDocHidden = true
      })
      // 解散团队
      this.bus.$on('dissolveTeam', (team) => {
        this.updataTeam(true)
      })
      // 创建团队
      this.bus.$on('createTeam', () => {
        this.updataTeam()
      })
      // 修改团队名称
      this.bus.$on('teamNameUpdate', (item) => {
        // 更新当前团队
        saveUserTeam(item)
        // 更新团队名称
        this.updataTeam()
      })

      this.userInfo = getUserInfo()
      this.currentTeam = getUserTeam()
      this.teamArr = this.userInfo.teamArr
      this.loadMessage()
    },
    created() {
      this.updataTeam()
    },
    destroyed() {
      this.bus.$off('applist')
      this.bus.$off('appdetail')
      this.bus.$off('allreadMessage')
      this.bus.$off('createTeam')
      this.bus.$off('dissolveTeam')
      this.bus.$off('miniAppDetail')
      this.bus.$off('miniApplist')
    },
    methods: {
      // dissolve是否是解散团队
      updataTeam(dissolve = false) {
        // 获取我的团队列表
        UserApi.getUserTeams().then((res) => {
          if (res.data.teams.length === 0) {
            this.$message.error('您当前没有加入任何团队')
            return
          }
          this.teamArr = res.data.teams
          // 存最新的teamarr
          updateTeamArr(this.teamArr)
          if (dissolve) {
            saveUserTeam(this.teamArr[0])
            this.bus.$emit('refreshList')
          } else {
          }
          this.userInfo = getUserInfo()
          this.teamArr = this.userInfo.teamArr
          this.currentTeam = getUserTeam()
        }, reject => {
        })
      },
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
        this.bus.$emit('showUserInfo')
      },
      loginout() {
        TokenMgr.clearTokens()
        removeUserInfo()
        this.$router.replace('/login')
      },
      clickMessage() {
        this.bus.$emit('showUserMessage')
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
        // 模拟点击，取消弹框
        document.querySelector('#app').click()
        // 更新当前团队
        saveUserTeam(item)
        // 更新team
        this.currentTeam = getUserTeam()
        // 刷新app列表
        this.bus.$emit('refreshList')
      },
      clickTeamBtn() {
        if (this.isAppList) {
        } else {
        }
      },
      // 点击我的团队，返回
      clickFlagBtn() {
        console.log(this.$route.fullPath)
        if (this.$route.fullPath.indexOf('/app/') !== -1) {
          this.$router.push('/apps')
        }
        if (this.$route.fullPath.indexOf('/miniApp/') !== -1) {
          this.$router.push('/miniAppList')
        }
      },
      popovershow() {
        this.$refs.arrow.style.transform = `rotate(-180deg)`
      },
      popoverhide() {
        this.$refs.arrow.style.transform = `rotate(0deg)`
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .headernav-wrapper {
  }
  .el-popover {
    top: 60px !important;
    left: 200px !important;
  }
  .headernav-wrapper .leftWrapper {
    float: left;
    display: flex;
    flex-direction: row;
    position: relative;
  }

  .leftWrapper-item {
    height: 48px;
    line-height: 48px;
    //border-bottom: solid 1px #eee;
    box-sizing: border-box;
  }

  .leftWrapper-item:hover {
    background-color: #f0f1fe;
  }

  .leftWrapper-item p {
    margin-left: 12px;
    margin-right: 12px;
  }

  .el-popover {
    padding: 0px !important;
  }

  .headernav-wrapper .leftWrapper .team .teamBtn {
    padding: 0px 10px;
    margin-top: 11px;
    color: $mainTitleColor;
    border-color: transparent;
    max-width: 300px;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    font-family: "PingFang SC";
  }
  .headernav-wrapper .leftWrapper .team .teamBtn span {
    height: 50px;
    line-height: 50px;
  }

  .headernav-wrapper .leftWrapper .team .flagBtn {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border-color: transparent;
    background-color: transparent;
  }

  .headernav-wrapper .leftWrapper .detail p {
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
    border-top: solid 1px #fff;
    border-left: solid 1px #fff;
    border-right: solid 1px #fff;
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
  .headernav-wrapper .rightWrapper .userInfoSub:hover {
    background-color: #eee;
  }
</style>
