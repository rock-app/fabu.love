<template>
  <div class="regiest-wrapper">
    <div class="regiest-header">
      <div class="regiest-header-title">
        <span>注册</span>
      </div>
    </div>

    <el-form class="form-wrapper" ref="form" :model="form">
      <el-input class="regiest-input" v-model="form.userName" placeholder="请输入用户名"></el-input>
      <el-input class="regiest-input" v-model="form.password" placeholder="请输入密码" ></el-input>
      <el-input class="regiest-input" v-model="form.repassword" placeholder="请再次输入密码"></el-input>
    </el-form>

    <div class="regiest-footer">
      <el-button class="regiestButton btnCommon" @click="onRegiestSure">注册</el-button>
      <div>
        <el-button class="loginButton btnCommon" @click="onLoginAgain">我是老用户，要登录</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        form: {
          userName: '',
          password: '',
          repassword: ''
        }
      }
    },
    methods: {
      onRegiestSure() {

      },
      onLoginAgain() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";
  .regiest-header {
    width: 100%;
    height: 60px;
    margin-top: 200px;
    text-align: center;
    margin-bottom: 40px;
  }
  .regiest-header-title {
    display: inline-block;
    width: 60%;
    height: 100%;
    line-height: 60px;
    font-size: 24px;
    color: #505556;
  }
  .regiest-header-title span {
    vertical-align: middle;
    color: #666;
  }
  .regiest-header-title span:before, .regiest-header-title span:after {
    content: '';
    display: inline-block;
    background: #BABFC3;
    width: 50%;
    height: 1px;
    vertical-align: middle;
  }
  .regiest-header-title span:before {
    margin: 0 5% 0 -50%;
  }
  .regiest-header-title span:after {
    margin: 0 -50% 0 5%;
  }
  .form-wrapper {
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  .regiest-input {
    width: 360px;
    height: 50px;
    margin: 0 auto;
  }
  .regiest-footer {
    width: 100%;
    text-align: center;
  }
  .btnCommon {
    width: 360px;
    height: 50px;
    margin: 0 auto;
    margin-top: 30px;
    font-size: 18px;
  }
  .regiestButton {
    background-color: #E2644C;
    color: white;
  }
  .loginButton {
    color: #E2644C;
    margin-top: 15px;
    border-color: #E2644C;
  }
</style>
