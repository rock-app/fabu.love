<template>
  <div class="upload-wrapper">
    <div class="uploadViewWrapper">
      <div class="top">
        <img class="appImg" src="../../assets/background.png" alt="">
        <div class="closeWrapper" @click="clickClose">
          <img src="../../assets/close.png" alt="">
        </div>
        <div class="appInfoWrapper">
          <p>1.0.1</p>
          <p style="margin-left: 20px">企业版</p>
        </div>
        <div class="appNameWrapper">
          <input type="text">
        </div>
      </div>
      <div style="width: 100%;height: 1px;background-color: #eee"></div>
      <div class="middle">
        <el-form ref="form" :model="form" label-width="100px" style="padding: 30px 30px 30px 50px">
          <el-form-item label="短链接">
            <div style="margin-left: 30px">
              <el-input v-model="form.shortLink">
                <template slot="prepend">Http://</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="更新日志">
            <textarea class="update" name="" id=""></textarea>
          </el-form-item>
        </el-form>
      </div>
      <el-button class="bottom"><i class="el-icon-upload el-icon--left"></i> 开始上传</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        form: {
          shortLink: '',
          updateRecord: ''
        }
      }
    },
    created() {},
    methods: {
      clickClose() {
        this.$emit('closeUpload')
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";
  .upload-wrapper {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    padding-top: 8%;
  }
  .uploadViewWrapper {
    width: 550px;
    height: 65%;
    background-color: white;
    border-radius: 12px;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
  }
  .uploadViewWrapper .top {
    position: relative;
    width: 100%;
    height: 35%;
  }
  .uploadViewWrapper .top .appImg {
    width: 100px;
    height: 100px;
    border-radius: 15px;
    position: absolute;
    left: 40px;
    top: 70px;
  }
  .uploadViewWrapper .top .closeWrapper img {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 20px;
    height: 20px;
  }
  .uploadViewWrapper .top .appInfoWrapper {
    position: absolute;
    left: 180px;
    top: 75px;
    right: 30px;
  }
  .uploadViewWrapper .top .appInfoWrapper p {
    display: inline-block;
  }
  .uploadViewWrapper .top .appNameWrapper {
    position: absolute;
    left: 180px;
    top: 110px;
    right: 55px;
  }
  .uploadViewWrapper .top .appNameWrapper input {
    width: 100%;
    height: 50px;
    border-radius: 6px;
    font-size: 16px;
    border: solid 1px #ccc;
    padding: 0px 10px;
    color: #333;
  }
  .uploadViewWrapper .middle {
    width: 100%;
    height: 50%;
  }
  .uploadViewWrapper .middle .update {
    display: inline-block;
    margin-left: 30px;
    width: 318px;
    height: 100px;
    outline: 0;
    border-radius: 6px;
    border-color: #ccc;
    padding: 10px;
    font-size: 18px;
  }
  .uploadViewWrapper .bottom {
    width: 100%;
    height: 15%;
    background-color: #F8BA0B;
    position: absolute;
    bottom: 0px;
    color: white !important;
    font-size: 20px;
    border-radius: 0px;
  }
</style>
