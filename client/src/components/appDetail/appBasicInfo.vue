<template>
  <div class="appBaseInfo-wrapper">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="应用 ID" style="height: 60px">
        <span style="margin-left: 150px; color: #555;font-size: 20px;">212121212121212121212</span>
      </el-form-item>
      <hr style="opacity: 0.2">
      <el-form-item label="应用名称" style="margin-top: 30px">
        <el-input v-model="form.appName"></el-input>
      </el-form-item>
      <el-form-item label="短链接" style="margin-top: 30px">
        <el-input v-model="form.shortLink">
        </el-input>
      </el-form-item>
      <el-form-item label="应用图标" style="margin-top: 30px">
        <img class="appBaseInfo-appicon" src="../../assets/backgroundImage.png" alt="">
      </el-form-item>
      <el-form-item label="应用描述" style="margin-top: 30px">
        <el-input type="textarea" v-model="form.appDesc"></el-input>
      </el-form-item>
      <el-form-item label="" style="margin-top: 30px">
        <el-button class="appBaseInfo-savebtn" round>保存</el-button>
        <el-button class="appBaseInfo-cancelbtn" type="primary" round>取消</el-button>
      </el-form-item>
      <hr style="opacity: 0.2;margin-top: 60px">
      <el-form-item label="应用截图" style="margin-top: 30px">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList2"
          list-type="picture">
          <el-button style="background-color: #F8BA0B !important;border-width: 0px" size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <hr style="opacity: 0.2;margin-top: 60px">
      <el-form-item label="删除应用" style="margin-top: 30px">
        <el-button class="appBaseInfo-delectbtn" round>删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        form: {
          appName: '订货宝',
          shortLink: 'http:12121',
          appDesc: ''
        },
        fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .appBaseInfo-wrapper {
    padding: 80px 15%;
  }
  .el-form-item__label {
    color: #9b9b9b;
    font-size: 18px;
  }
  .el-input__inner {
    width: 500px;
    height: 50px !important;
    margin-left: 150px;
    background-color: #F6F6F6;
    font-size: 20px;
  }
  .appBaseInfo-appicon {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    background-size: cover;
    margin-left: 150px;
  }
  .el-textarea__inner {
    background-color: #F6F6F6;
    margin-left: 150px;
    height: 260px;
  }
  .appBaseInfo-savebtn {
    margin-left: 150px;
    background-color: #F8BA0B !important;
    color: white;
  }
  .appBaseInfo-cancelbtn {
    background-color: rgba(0, 0, 0 ,0) !important;
    color: #333;
    border-width: 0px;
  }
  .upload-demo {
    margin-left: 150px;
  }
  .el-upload-dragger {
    background-color: #F6F6F6;
  }
  .appBaseInfo-delectbtn {
    width: 180px;
    margin-left: 150px;
    background-color: #F6F6F6 !important;
    color: red;
    border-color: red;
  }
</style>
