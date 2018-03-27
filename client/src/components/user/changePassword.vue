<template>
  <div class="changePasswordWrapper">
    <div class="errorInfo" v-html="this.errorInfo"></div>
    <input v-model="currentpwd" type="password" placeholder="当前密码">
    <input v-model="newpwd" type="password" placeholder="新密码">
    <input v-model="renewpwd" type="password" placeholder="确认密码">
    <button @click="clickChangeBtn">更新密码</button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        currentpwd: '',
        newpwd: '',
        renewpwd: '',
        errorInfo: ''
      }
    },
    created() {
    },
    methods: {
      clickChangeBtn() {
        if (this.currentpwd === '') {
          this.errorInfo = '*请输入当前密码'
          return
        }
        if (this.newpwd === '') {
          this.errorInfo = '*请输入新密码'
          return
        }
        if (this.renewpwd === '') {
          this.errorInfo = '*请输入确认密码'
          return
        }
        if (this.renewpwd !== this.newpwd) {
          this.errorInfo = '*两次输入密码不一致'
          return
        }
        this.errorInfo = ''
        console.log()
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .changePasswordWrapper {
    width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding-bottom: 200px;
  }
  .changePasswordWrapper input {
    width: 380px;
    height: 50px;
    padding: 0 10px;
    border: solid 1px #ccc;
    border-radius: 5px;
    margin-top: 8px;
    font-size: 14px;
  }
  .changePasswordWrapper .errorInfo {
    color: $warmRed;
    font-size: 14px;
    text-align: left;
    line-height: 40px;
    margin-top: 60px;
  }
  .changePasswordWrapper button {
    width: 100%;
    height: 50px;
    background-color: $warmRed;
    color: white;
    font-size: 15px;
    border-radius: 5px;
    border-color: transparent;
    margin-top: 50px;
    outline: 0;
  }
</style>
