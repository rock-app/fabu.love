<template>
  <div class="login">
      <img class="login-backgroundImage" src="@/assets/backgroundImage.png">
      <div class="login-intactive" :class="`${this.loginSizeStatus}`">
        <div class="login-title">
          <button class="login-btn-title" :class="`${this.loginStatus}`" @click="onLogin"> 登 录 </button>
          <button class="login-btn-title" :class="`${this.registerStatus}`" @click="onRegister"> 注 册 </button>
        </div>
        <div>
          <img src="@/assets/logo.png">
          <input type="text" placeholder="用户名" v-model="userName">
        </div>
        <div>
          <img src="@/assets/logo.png">
          <input type="text" placeholder="密码" v-model="password">
        </div>
        <div v-show="!isLogin">
          <img src="@/assets/logo.png">
          <input type="text" placeholder="确认密码" v-model="repwd">
        </div>
        <div><button class="login-btn-submit" @click="onClick">{{pageStatus}}</button></div>
      </div>
  </div>
</template>

<script>
import LoginApi from '../api/LoginApi'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      repwd: '',
      isLogin: true,
      buttonText: ''
    }
  },
  computed: {
    pageStatus () {
      return this.isLogin ? '登 录' : '注 册'
    },
    loginStatus () {
      return this.isLogin ? 'login-btn-title-selected' : 'login-btn-title-unselected'
    },
    registerStatus () {
      return this.isLogin ? 'login-btn-title-unselected' : 'login-btn-title-selected'
    },
    loginSizeStatus () {
      return this.isLogin ? 'login-intactive-login' : 'login-intactive-register'
    }
  },
  methods: {
    onClick () {
      if (this.isLogin) {
        var me = this
        LoginApi.login(this.username, this.password).then((resp) => {
          me.$router.push('applist')
          console.log(resp.data)
        }).catch((error) => {
          console.log(error)
        })
      } else {
        LoginApi.register(this.username, this.password).then((resp) => {
          console.log(resp.data)

        }).catch((error) => {
          console.log(error)
        })
      }
    },
    onLogin () {
      this.isLogin = true
    },
    onRegister () {
      this.isLogin = false
    }
  }
}
</script>

<style scoped>
  .login {
    position: absolute;
    background-color: rgb(70, 72, 83);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    overflow: hidden;
  }
  .login-backgroundImage {
    width: 100%;
    height: 100%;
  }
  .login-intactive {
    position: absolute;
    background-color: white;
    width: 400px;
    height: 200px;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .login-intactive-login {
    height: 200px;
  }
  .login-intactive-register {
    height: 250px;
  }
  .login-intactive > div:first-child {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .login-intactive > div:nth-last-child(-n+4) {
    margin: 20px 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .login-btn-title {
    width: 200px;
    border: none;
    margin: 0px;
    height: 40px;
  }
  .login-btn-title-selected {
    background-color: #008CBA;
    color: white;
  }
  .login-btn-title-unselected {
    background-color: gray;
    color: black;
  }
  img {
    width: 20px;
    height: 20px;
  }
  .login-btn-submit {
    border: none;
    border-radius: 0px;
    background-color: #008CBA;
    color: white;
    width: 200px;
    height: 33px;
  }
</style>