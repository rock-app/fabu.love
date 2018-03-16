<template>
  <div>
    <div class="applist-nav">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="applist-nav-left">
        <el-breadcrumb-item>App-publisher</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/applist' }">我的应用</el-breadcrumb-item>
        <el-breadcrumb-item v-if="this.appSubModule" v-show="this.appSubModule" v-html="this.appSubModule"></el-breadcrumb-item>
      </el-breadcrumb>
      <div class="userInfoBottomWrapper" :style="this.userHover? 'background-color: rgb(244, 245, 247)':'background-color: white'" @mouseover="userInfoHovered" @mouseout="userInfoUnhovered">
        <div class="userInfoWrapper">
          <img src="../../assets/logo.png" alt="">
          <div class="ueserInfo-username nowrap" v-if="this.userInfo">
            {{this.userInfo.userName}}
          </div>
          <p class="ueserInfo-email nowrap">dede12121212@qq.com</p>
        </div>
      </div>
      <ul class="userInfoSubWrapper" v-show="this.userHover" @mouseover="userInfoHovered" @mouseout="userInfoUnhovered">
        <li class="userInfoSub" @click="clickUserInfoWrapper">
          <span>个人资料</span>
        </li>
        <li class="userInfoSub" @click="loginout">
          <span>退出</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getUserInfo} from '../../mgr/userMgr'

  export default {
    props: {
      appSubModule: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        userHover: false,
        userInfo: {
        }
      }
    },
    created() {
      let user = getUserInfo()
      this.userInfo = user
    },
    methods: {
      userInfoHovered() {
        this.userHover = true
      },
      userInfoUnhovered() {
        this.userHover = false
      },
      clickUserInfoWrapper() {
        this.$router.push('userInfo')
      },
      loginout() {
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .applist-nav {
    width: 100%;
    height: 85px;
    position: relative;
    background-color: white;
  }
  .applist-nav-left {
    margin-left: 15%;
    height: 85px;
    line-height: 85px;
    font-size: 21px;
    font-weight: 400;
  }
  .userInfoBottomWrapper {
    position: absolute;
    right: 15%;
    top: 0px;
    width: 150px;
    height: 85px;
  }
  .userInfoBottomWrapper:hover {
    background-color: $paleGreyTwo;
    border: solid 1px $paleGrey;
  }
  .userInfoWrapper {
    position: relative;
    margin-top: 17.5px;
    width: 150px;
    height: 50px;
  }
  .userInfoWrapper img {
    width: 50px;
    height: 50px;
  }
  .ueserInfo-username {
    position: absolute;
    top: 5px;
    left: 60px;
    font-size: 14px;
    color: #333;
    width: 90px;
  }
  .ueserInfo-email {
    position: absolute;
    top: 25px;
    left: 60px;
    font-size: 12px;
    color: grey;
    width: 90px;
  }
  .userInfoSubWrapper {
    position: absolute;
    right: 15%;
    top: 85px;
    width: 150px;
    height: 50px;
    z-index: 100;
  }
  .userInfoSub {
    width: 150px;
    height: 44px;
    background-color: $paleGreyTwo;
    border: solid 1px $paleGrey;
    box-sizing: border-box;
  }
  .userInfoSub span {
    margin-left: 30px;
    line-height: 44px;
    height: 44px;
    color: #999;
  }
  .userInfoSub span:hover {
    color: #333;
  }
</style>
