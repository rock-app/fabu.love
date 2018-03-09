<template>
  <div class="appVersion-wrapper">
    <!--头部-->
    <div class="appversion-header">
      <div class="appversion-header-leftLine">
        <div class="appversion-header-leftLine-dot"></div>
        <div class="appversion-header-leftLine-line"></div>
      </div>
      <div class="appversion-header-right">
        <el-form ref="form">
          <el-form-item class="appversion-header-form" label="版本更新">
            <button class="appversion-header-backbtn">回退</button>
          </el-form-item>
          <el-form-item class="appversion-header-form-address" label="商店地址：" style="">
            <input :disabled="!this.isFix" :style="setBackgroudColor" type="text" placeholder="未填写">
            <button @click="clickFixBtn" v-html="this.isFix ? `保存`:`修改`"></button>
            <button @click="clickCancelBtn" style="margin-left: 3px" v-show="this.isFix">取消</button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--内容-->
    <div class="appversion-versionList">
      <ul style="position: relative">
        <li v-for="item in dataArr" :key="item" class="appversion-versionList-item">
          <div class="appversion-versionList-left-iconWrapper">
            <img src="../../assets/uploadVersion.png" alt="">
          </div>
          <div class="appversion-versionList-left-line"></div>
          <div class="appversion-versionList-right">
            <div class="appversion-versionList-itemtitle" v-html="item"></div>
            <div class="appversion-versionList-itemInfo">
              <span>21212121212</span>
              <span class="versionType">企业版</span>
              <span>XC:com.hd.123.com-sahnghaiasasasasasasasasas</span>
            </div>
            <div class="appversion-versionList-itemBottom">
              <el-button round>编辑</el-button>
              <el-button round><i class="el-icon-upload el-icon--left"></i>10.36M</el-button>
              <el-button round><i class="el-icon-upload el-icon--left"></i>预览</el-button>
              <el-button round><i class="el-icon-upload el-icon--left"></i>标记上线</el-button>
              <el-switch
                style="margin-left: 15px"
                v-model="showInDownLoadPage"
                active-color="#F8BA0B"
                inactive-color="#999">
              </el-switch><span style="color: #999; font-size: 15px;vertical-align: middle;margin-left: 10px">显示在下载页面</span>
            </div>
          </div>
        </li>
        <div class="appversion-versionList-itemFooter" @click="loadMore">显示更多版本</div>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        isFix: false,
        dataArr: ['1.1.0', '1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.1.5', '1.1.6', '1.1.7'],
        showInDownLoadPage: false
      }
    },
    computed: {
      setBackgroudColor() {
        if (this.isFix) {
          return `backgroundColor: white;`
        } else {
          return `backgroundColor: rgb(244,245,247);`
        }
      }
    },
    methods: {
      clickFixBtn() {
        this.isFix = !this.isFix
      },
      clickCancelBtn() {
        this.isFix = false
      },
      loadMore() {
        setTimeout(() => {
          this.dataArr.push(...['5555', '6666666'], '77777')
        }, 1000)
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .appVersion-wrapper {
    padding: 80px 15%;
  }
  .appversion-header {
  }
  .appversion-header-leftLine {
    display: inline-block;
  }
  .appversion-header-leftLine-dot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #666;
  }
  .appversion-header-leftLine-line {
    width: 1px;
    height: 125px;
    background-color: #ccc;
    margin-left: 4px;
  }
  .appversion-header-right {
    width: 80%;
    display: inline-block;
    margin-left: 50px;
    vertical-align: top;
  }
  .appversion-header-form {
    margin-top: -13px;
  }
  .appversion-header-form .el-form-item__label {
    font-size: 14px;
    font-weight: bold;
    text-align: left;
  }
  .appversion-header-form-address .el-form-item__label {
    font-size: 14px;
    text-align: left;
  }
  .appversion-header-form-address input {
    width: 400px;
    height: 40px;
    border: solid 1px #999;
    border-radius: 5px;
    background-color: $paleGrey;
    padding-left: 8px;
    outline: 0;
  }
  .appversion-header-form-address button {
    width: 50px;
    height: 40px;
    border: solid 1px #999;
    color: #999;
    border-radius: 4px;
    background-color: $paleGrey;
    vertical-align: top;
    margin-left: 10px;
    outline: 0;
  }
  .appversion-header-backbtn {
    background-color: $paleGrey;
    width: 80px;
    height: 30px;
    margin-left: 20px;
    border-radius: 15px;
    color: #666;
  }
  /*列表的样式*/
  .appversion-versionList-item {
    position: relative;
    height: 180px;
  }
  .appversion-versionList-left-iconWrapper {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: solid 1px #999;
    background-color: $paleGrey;
    text-align: center;
    position: absolute;
    left: -20px;
  }
  .appversion-versionList-left-iconWrapper img {
    width: 25px;
    height: 25px;
    margin-top: 12.5px;
  }
  .appversion-versionList-left-line {
    width: 1px;
    height: 130px;
    background-color: #ccc;
    position: absolute;
    top: 50px;
    left: 5px;
  }
  .appversion-versionList-right {
    height: 120px;
    display: inline-block;
    vertical-align: top;
    margin-left: 65px;
  }
  .appversion-versionList-itemtitle {
    font-size: 18px;
    font-weight: bold;
    margin-top: 5px;
  }
  .appversion-versionList-itemInfo {
    font-size: 10px;
    color: #999;
    margin-top: 15px;
  }
  .versionType:before {
    content: "·";
    color: #999;
    margin-left: 8px;
    margin-right: 8px;
  }
  .versionType:after {
    content: "·";
    color: #999;
    margin-left: 8px;
    margin-right: 8px;
  }
  .appversion-versionList-itemBottom {
    margin-top: 20px;
  }
  .appversion-versionList-itemBottom .el-button {
    background-color: $paleGrey !important;
    color: #999 !important;
  }
  .appversion-versionList-itemFooter {
    position: absolute;
    width: 160px;
    height: 40px;
    left: -20px;
    border-radius: 20px;
    border: solid 1px #999;
    font-size: 15px;
    color: #999;
    text-align: center;
    line-height: 40px;
  }
</style>
