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
    position: fixed;
    display: flex;
    display: -webkit-flex;
    background-image: url("../../assets/bg.png");
    background-size: 100% 100%;
    font-family: PingFangSC;
  }

  .user-left {
    width: 41.7%;
    height: 100%;
    background: $mainColor;
    opacity: 0.9;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: center;
  }

  .user-right {
    width: 58.3%;
    height: 100%;
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


</style>
