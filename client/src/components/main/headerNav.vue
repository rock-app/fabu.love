<template>
  <div class="headernav-wrapper">
    <div class="leftWrapper"></div>
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
  import {getUserInfo, removeUserInfo} from '../../mgr/userMgr'
  import Bus from '../../common/js/bus'
  import TokenMgr from '../../mgr/TokenMgr'
  import * as UserApi from '../../api/moudle/userApi'

  export default {
    data() {
      return {
        userInfo: {},
        userHover: false,
        messageArr: [{'msg': '12121212121'}, {'msg': '2121212121212'}],
        redDocHidden: false
      }
    },
    created() {
      this.userInfo = getUserInfo()
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
        UserApi.getUserMessage(0).then((res) => {
          console.log(res)
          if (res.data.length > 0) {
            this.redDocHidden = false
          }
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
