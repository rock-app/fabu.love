<template>
    <div class="miniApplist-wrapper">
      <!--内容头部-->
      <div class="applist-header">
        <div class="left" style="position: relative">
          <div
            style="width: 120px;height: 16px;background-color: #6477F2;position: absolute;top: 30px;left: 12px;border-radius: 10px;filter: blur(10px);z-index: -1"></div>
          <el-button class="uploadWrapper button-style-main" @click="addMiniApp"><i class="el-icon-plus"></i>新建小程序</el-button>
        </div>
      </div>

      <!--新增小程序-->
      <el-dialog
        title="新建小程序"
        :visible.sync="showAddAppContent"
        width="30%"
        center>
        <el-form ref="form" :model="miniAppInfo" label-width="80px">
          <el-form-item label="项目名称">
            <el-input v-model="miniAppInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="AppKey">
            <el-input v-model="miniAppInfo.appKey"></el-input>
          </el-form-item>
          <el-form-item label="AppSecret">
            <el-input v-model="miniAppInfo.appSecret"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showAddAppContent = false">取 消</el-button>
          <el-button type="primary" @click="showAddAppContent = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showAddAppContent: false,
        miniAppInfo: {}
      }
    },
    created() {},
    methods: {
      addMiniApp() {
        this.showAddAppContent = true
      }
    }
  }
</script>

<style lang="scss">
    @import "../../common/scss/base";
    .miniApplist-wrapper {
      padding-left: 20px;
      padding-right: 20px;
      min-width: 660px;
    }
    .miniApplist-wrapper .applist-header {
      height: 75px;
      padding-top: 25px;
    }
    .miniApplist-wrapper .applist-header .uploadWrapper {
      width: 144px;
      float: left;
    }
    .miniApplist-wrapper .applist-header .uploadWrapper i {
      margin-right: 15px;
    }
</style>
