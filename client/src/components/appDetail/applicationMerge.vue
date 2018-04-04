<template>
  <div class="applicationMerge-wrapper">
    <div class="currentApplication">
      <img src="" alt="">
    </div>
    <div class="otherApplication">
      <div class="otherApplication-left">
        <p class="title">选择已有的应用进行合并</p>
        <img src="." alt="">
        <p class="appname">好乡亲</p>
      </div>
      <hr>
      <div class="otherApplication-right">
        <p>或输入需要合并应用的短链接</p>
        <input type="text" placeholder="输入短链接并查询">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

</script>

<style lang="scss">
  @import "../../common/scss/base";

  .applicationMerge-wrapper {
    display: flex;
    flex-direction: column;
    padding-top: 80px;
  }
  .currentApplication {
    text-align: center;
    margin-bottom: 30px;
  }
  .currentApplication img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }
  .otherApplication {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0 auto;
  }
  .otherApplication-left {
    width: 300px;
    height: 220px;
    text-align: center;
  }
  .otherApplication hr {
    width: 0.5px;
    height: 220px;
    background-color: $paleGrey;
    opacity: 0.2;
  }
  .otherApplication-right {
    width: 300px;
    height: 220px;
    text-align: center;
  }
  .otherApplication-left .title {
    font-size: 16px;
    color: #999;
  }
  .otherApplication-left img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    margin-top: 30px;
  }
  .otherApplication-left .appname {
    margin-top: 5px;
    font-size: 12px;
    color: #666;
  }
  .otherApplication-right p {
    font-size: 16px;
    color: #999;
  }
  .otherApplication-right input {
    margin-top: 40px;
    width: 200px;
    height: 30px;
    border-radius: 15px;
    border: solid 1px #999;
    padding-left: 10px;
    font-size: 15px;
    outline: 0px;
  }
</style>
