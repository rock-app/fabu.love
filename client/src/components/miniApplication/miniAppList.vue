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

      <!--应用列表-->
      <miniAppItem
        :dataArr="this.dataList"
        @gotoAppDetail="gotoAppDetail"
      >
      </miniAppItem>

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
          <el-form-item label="AppId">
            <el-input v-model="miniAppInfo.appId"></el-input>
          </el-form-item>
          <el-form-item label="AppSecret">
            <el-input v-model="miniAppInfo.appSecret"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showAddAppContent = false">取 消</el-button>
          <el-button type="primary" @click="clickSure">确 定</el-button>
        </span>
      </el-dialog>

      <emptyView v-if="this.showEmpty"></emptyView>
    </div>
</template>

<script type="text/ecmascript-6">
  import * as MiniApi from '../../api/moudle/miniApi'
  import EmptyView from '../appList/emptyView.vue'
  import { getUserTeam } from '../../mgr/userMgr'
  import MiniAppItem from '../base/miniAppItem.vue'

  export default {
    data() {
      return {
        showAddAppContent: false,
        miniAppInfo: {
          name: '',
          appId: '',
          appSecret: ''
        },
        showEmpty: false,
        dataList: [],
        currentTeam: {}
      }
    },
    components: {
      EmptyView, MiniAppItem
    },
    created() {
    },
    mounted() {
      this.bus.$emit('miniApplist')
      this.currentTeam = getUserTeam()
      this.loadAppList()
    },
    methods: {
      loadAppList() {
        MiniApi.getAppList(this.currentTeam._id)
          .then(response => {
            this.dataList = []
            this.dataList = response.data.reverse()
            if (this.dataList.length === 0) {
              this.showEmpty = true
            } else {
              this.showEmpty = false
            }
            console.log(this.dataList)
          }, reject => {
            this.$message.error(reject)
            this.showEmpty = true
          })
      },
      addMiniApp() {
        this.showAddAppContent = true
      },
      clickSure() {
        if (this.miniAppInfo.name === '') {
          this.$message.error('请输入小程序应用名称')
          return
        }
        if (this.miniAppInfo.appId === '') {
          this.$message.error('请输入小程序appId')
          return
        }
        if (this.miniAppInfo.appSecret === '') {
          this.$message.error('请输入小程序appSecret')
          return
        }
        let body = {
          'name': this.miniAppInfo.name,
          'appId': this.miniAppInfo.appId,
          'appSecret': this.miniAppInfo.appSecret,
          'teamId': this.currentTeam._id
        }
        MiniApi.create(body).then(response => {
          this.showAddAppContent = false
          this.loadAppList()
        }, reject => {

        })
      },
      gotoAppDetail(item) {
        this.$router.push({
          name: 'MiniAppDetail',
          params: {appId: item._id}
        })
        this.bus.$emit('miniAppDetail')
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
