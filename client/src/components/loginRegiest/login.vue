<template>
  <div class="login-wrapper">
    <div class="login-header">
      <div class="header-title">
        <span>登录</span>
      </div>
    </div>
    <div class="login-content">
      <ul class="errorInfowrapper">
        <li class="errorInfo">{{errorInfo}}</li>
      </ul>
      <el-input clearable class="userName input" @keyup.enter="onLogin"  v-model="userName" placeholder="用户名"></el-input>
      <el-input clearable class="password input" @keyup.enter="onLogin"  v-model="pwd" placeholder="密码" type="password"></el-input>

      <el-button class="loginBtn btn" @click="onLogin">登录</el-button>
      <div class="regiestwrapper">
        <el-button class="regiestBtn btn" @click="onRegiest">注册</el-button>
      </div>
    </div>
    <div class="login-footer"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as LoginApi from '../../api/moudle/loginApi'
  import TokenMgr from '../../mgr/TokenMgr'
  import {saveUserInfo} from '../../mgr/userMgr'

  export default {
    data() {
      return {
        userName: '',
        pwd: '',
        isLogin: false,
        errorInfo: ''
      }
    },
    created() {
      this.$nextTick(() => {
      })
    },
    components: {
    },
    methods: {
      onLogin() {
        if (this.userName.length === 0) {
          this.errorInfo = '* 用户名不能为空'
          return
        }
        if (this.pwd.length === 0) {
          this.errorInfo = '* 密码不能为空'
          return
        }
        this.errorInfo = ''
        let body = {
          'username': this.userName,
          'password': this.pwd
        }
        LoginApi.login(body)
          .then(response => {
            // 存储token
            console.log(response)
            TokenMgr.add(this.axios.baseURL, response.data.token)
            let user = {
              'userName': this.userName,
              'userId': response.data._id,
              'teamArr': response.data.teams
            }
            saveUserInfo(user)
            this.axios.defaults.headers.Authorization = 'Bearer' + ' ' + response.data.token
            this.$router.push('/')
          }, reject => {
            this.$message.error(reject)
          })
      },
      onRegiest() {
        this.$router.push({
          path: '/regiest'
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .login-header {
    width: 100%;
    height: 60px;
    margin-top: 200px;
    text-align: center;
    margin-bottom: 40px;
  }
  .errorInfowrapper {
    width: 360px;
    height: 30px;
    margin: 0 auto;
  }
  .errorInfo {
    text-align: left;
    color: #E2644C;
    font-size: 12px;
  }
  .header-title {
    display: inline-block;
    width: 60%;
    height: 100%;
    line-height: 60px;
    font-size: 24px;
    color: #505556;
  }
  .header-title span {
    vertical-align: middle;
    color: #666;
  }
  .header-title span:before, .header-title span:after {
    content: '';
    display: inline-block;
    background: #BABFC3;
    width: 50%;
    height: 1px;
    vertical-align: middle;
  }
  .header-title span:before {
    margin: 0 5% 0 -50%;
  }
  .header-title span:after {
    margin: 0 -50% 0 5%;
  }
  .login-content {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  .login-wrapper .login-content .input {
    width: 360px;
    display: inline-block;
    margin: 0 auto;
  }
  .login-wrapper .login-content .userName {
    margin-bottom: 10px;
  }
  .btn {
    width: 360px;
    height: 50px;
    margin: 0 auto;
    margin-top: 30px;
    font-size: 18px;
  }
  .loginBtn {
    background-color: #E2644C;
    color: white;
  }
  .regiestBtn {
    color: #E2644C;
    margin-top: 0px;
    border-color: #E2644C;
  }
  .regiestwrapper {
    width: 100%;
    height: 50px;
    margin-top: 20px;
  }
  .login-footer {
    width: 100%;
    height: 100px;
    margin-top: 50px;
  }
</style>
