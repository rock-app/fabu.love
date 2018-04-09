<template>
  <div class="userInfo-wrapper" @click="cancel">
    <transition name="fadeRight">

      <div v-show="this.show" class="userInfo-wrapper-body" @click.stop="clickcontent">
        <div class="userWrapper">
          <div class="imgwrapper">
            <img src="../../assets/ic_touxiang.png" alt="">
          </div>
          <p class="nowrap">{{this.userInfo.userName}}</p>
        </div>
        <ul class="userInfo-wrapper-nav">
          <li v-for="item in navArr" :style="getactiveClass(item)" :key="item" class="userInfo-wrapper-nav-sub" @click="clickItem(item)">
            {{item}}
          </li>
        </ul>

        <personalInfo :userInfo="this.userInfo" v-if="this.currentItem === '个人资料'" @cancel="cancel"></personalInfo>
        <changePassword v-if="this.currentItem === '修改密码'" @cancel="cancel"></changePassword>
      </div>
    </transition>

  </div>
</template>

<script type="text/ecmascript-6">

  import ChangePassword from './changePassword.vue'
  import PersonalInfo from './personalInfo.vue'
  import {getUserInfo} from '../../mgr/userMgr'

  export default {
    components: {
      ChangePassword, PersonalInfo
    },
    data() {
      return {
        show: false,
        navArr: ['个人资料', '修改密码'],
        currentItem: '个人资料',
        userInfo: {}
      }
    },
    created() {
      setTimeout(() => {
        this.show = true
      }, 100)
      this.userInfo = getUserInfo()
    },
    computed: {
    },
    methods: {
      clickItem(item) {
        this.currentItem = item
      },
      getactiveClass(item) {
        if (item === this.currentItem) {
          return `color: #6477F2;borderBottomColor: #6477F2`
        }
      },
      cancel() {
        this.show = false
        setTimeout(() => {
          this.bus.$emit('hiddenUserInfo')
        }, 500)
      },
      clickcontent() {}
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
  .userInfo-wrapper {
    position: fixed;
    top: 72px;
    left: 0px;
    bottom: 0px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 1000;
  }
  .userInfo-wrapper-body {
    float: right;
    width: 480px;
    height: 100%;
    margin-right: 0;
    background-color: white;
    box-shadow: 0 2px 6px rgba(120, 120, 120, 0.5);
    overflow: scroll;
  }
  .userInfo-wrapper-body .userWrapper {
    font-size: 0px;
    padding-top: 22px;
  }
  .userWrapper .imgwrapper {
    width: 72px;
    height: 72px;
    border-radius: 36px;
    margin-left: 48px;
    display: inline-block;
    vertical-align: middle;
  }
  .userWrapper .imgwrapper img {
    width: 52px;
    height: 52px;
    border-radius: 26px;
    background-size: 52px 52px;
    margin-left: 10px;
    margin-top: 10px;
  }
  .userWrapper p {
    display: inline-block;
    font-size: 24px;
    font-weight: bold;
    color: $mainColor;
    height: 72px;
    line-height: 72px;
    vertical-align: middle;
    margin-left: 24px;
  }
  .userInfo-wrapper-nav {
    margin-top: 24px;
    width: 100%;
    height: 48px;
    border-bottom: solid 1px #eee;
  }
  .userInfo-wrapper-nav-sub {
    width: 96px;
    height: 48px;
    display: inline-block;
    color: $subTitleColor;
    margin-left: 48px;
    line-height: 48px;
    text-align: center;
    border-bottom: solid 1px transparent;
  }
</style>
