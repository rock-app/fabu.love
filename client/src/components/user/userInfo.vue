<template>
  <div class="userInfo-wrapper">
    <div class="userInfo-wrapper-header">
      <p @click="gotoHome">App-Publisher</p>
      <button>退出登录</button>
    </div>
    <div class="userInfo-wrapper-body">
      <div class="userWrapper">
        <img src="../../assets/backgroundImage.png" alt="">
        <p>小强</p>
      </div>
      <ul class="userInfo-wrapper-nav">
        <li v-for="item in navArr" :style="getactiveClass(item)" :key="item" class="userInfo-wrapper-nav-sub" @click="clickItem(item)">
          <i class="el-icon-date"></i> {{item}}
        </li>
      </ul>

      <personalInfo v-show="this.currentItem === '个人资料'"></personalInfo>
      <changePassword v-show="this.currentItem === '修改密码'"></changePassword>
      <certification v-show="this.currentItem === '实名认证'"></certification>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  import Certification from './certification.vue'
  import ChangePassword from './changePassword.vue'
  import PersonalInfo from './personalInfo.vue'

  export default {
    components: {
      Certification, ChangePassword, PersonalInfo
    },
    data() {
      return {
        navArr: ['个人资料', '修改密码', '实名认证'],
        currentItem: '个人资料'
      }
    },
    created() {
    },
    computed: {
    },
    methods: {
      clickItem(item) {
        this.currentItem = item
      },
      getactiveClass(item) {
        if (item === this.currentItem) {
          return `color: #E2644C;borderBottomColor: #E2644C`
        }
      },
      gotoHome() {
        this.$router.push('applist')
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  body {
    background-color: white;
  }
  .userInfo-wrapper-header p {
    font-size: 20px;
    float: left;
    margin-left: 20px;
    line-height: 80px;
    color: #333;
    font-weight: bold;
  }
  .userInfo-wrapper-header button {
    float: right;
    color: $warmRed;
    border: solid 1px $warmRed;
    font-size: 16px;
    border-radius: 4px;
    width: 100px;
    height: 35px;
    margin-right: 20px;
    margin-top: 22.5px;
    background-color: white;
  }
  .userInfo-wrapper-header {
    height: 80px;
    background-color: white;
  }
  .userInfo-wrapper-body {
    display: flex;
    flex-direction: column;
    text-align: center;
    background-color: white;
  }
  .userWrapper img {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    margin-top: 100px;
    margin-bottom: 15px;
    color: $warmRed;
  }
  .userWrapper p {
    color: $warmRed;
  }
  .userInfo-wrapper-nav {
    width: 650px;
    height: 48px;
    color: #999;
    margin: 0 auto;
    margin-top: 30px;
  }
  .userInfo-wrapper-nav-sub {
    width: 200px;
    display: inline-block;
    border-bottom: solid 1px #ccc;
    margin-left: 7.5px;
    margin-right: 7.5px;
    line-height: 48px;
  }
</style>
