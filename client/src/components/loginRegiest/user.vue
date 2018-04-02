<template>
  <div class="user">
    <div class="user-left">

      <div class="user-logo"></div>
      <div class="user-divier"></div>
      <div class="user-name">爱发布 fabu.love</div>

      <div class="user-item" style="margin-top: 24.87vh">
        <img src="../../assets/ic_api1.png"/>
        <p>API文档</p>
      </div>
      <div class="user-item">
        <img src="../../assets/ic_help1.png"/>
        <p>Help</p>
      </div>
      <div class="user-item">
        <img src="../../assets/ic_github1.png"/>
        <p>Github</p>
      </div>
      <div class="user-item">
        <img src="../../assets/ic_about1.png"/>
        <p>About</p>
      </div>
    </div>
    <div class="user-right">
      <div class="user-login-panel">
        <div class="user-login-title">
          <p> 登&nbsp;&nbsp;&nbsp;&nbsp;录 <span>/Login</span></p>
        </div>

        <div class="user-login-form">
          <el-input
            class="user-login-form-input"
            placeholder="请输入用户名"
            prefix-icon="el-icon-edit">
          </el-input>

          <el-input
            class="user-login-form-input"
            placeholder="请输入密码"
            prefix-icon="el-icon-time">
          </el-input>

          <el-button class="user-login-form-btn" type="primary">立即登录</el-button>

          <div class="user-login-form-label">
            <p>没用账号？<span>立即注册</span></p>
          </div>
        </div>

      </div>

      <div class="user-footer-label">
        <p>版权所有©2018上海海鼎信息工程股份有限公司.保留所有权利.</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

</script>

<style lang="scss">
  @import "../../common/scss/base";

  .user {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    display: -webkit-flex;
    background-image: url("../../assets/bg.png");
    background-size: 100% 100%;
    font-family: PingFangSC;
    overflow: hidden;
  }

  .user-left {
    width: 40%;
    height: 100%;
    background: $mainColor;
    opacity: 0.9;
    display: flex;
    max-width: 500px;
    min-width: 200px;
    display: -webkit-flex;
    flex-direction: column;
    align-items: center;
  }

  .user-right {
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }

  .user-logo {
    width: 160px;
    height: 50px;
    margin-top: 17.6vh;
    background-image: url("../../assets/logo.png");
  }

  .user-divier {
    width: 168px;
    height: 3px;
    margin-top: 16px;
    background: white;
  }

  .user-name {
    font-size: 1.5em;
    color: white;
    margin-top: 24px;
    font-family: STYuanti-SC;
  }

  .user-item {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    margin-top: 24px;
  }

  .user-item img {
    width: 24px;
    height: 24px;
  }

  .user-item p {
    color: white;
    font-size: 1em;
    margin-left: 24px;
    width: 60px;
  }

  .user-login-panel {
    height: 528px;
    width: 408px;
    margin-top: 18.43vh;
    background-color: white;
    border-radius: 8px;
  }

  .user-login-title {
    height: 72px;
    width: 100%;
    font-size: 20px;
    line-height: 24px;
    padding-left: 48px;
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1)
  }

  .user-login-title p {
    color: rgba(53, 64, 82, 1);
    height: 100%;
    line-height: 72px;
  }

  .user-login-title p span {
    color: rgba(155, 155, 155, 1);
  }

  .user-login-form {
    width: 100%;
    text-align: center;
  }

  .user-login-form-input {
    width: 312px;
    height: 48px;
    margin-top: 48px;
    border-radius: 24px;
    border: 1px #6477F2 solid;
  }

  .user-login-form-btn {
    width: 312px;
    height: 48px;
    margin-top: 48px;
    border-radius: 24px;
    background: rgba(100, 119, 242, 1);
  }

  .user-login-form-label {
    margin-top: 48px;
  }

  .user-footer-label {
    display: block;
    width: 100%;
    height: 5rem;
    bottom: 0px;
    text-align: center;
    margin-top: 18.43vh;
  }

  .user-footer-label p {
    size: 1rem;
    color: white;
    margin: 0 auto;
  }


</style>
