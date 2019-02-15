<template>
    <div class="miniAppDetail-wrapper">
      <!--头部-->
      <miniAppDetailHeader
        :appInfo="this.appInfo"
        v-if="this.appInfo._id"
      >
      </miniAppDetailHeader>

      <div class="miniAppDetail-wrapper-applist-header">
        <div class="left" style="position: relative">
          <div
            style="width: 160px;height: 16px;background-color: #6477F2;position: absolute;top: 30px;left: 12px;border-radius: 10px;filter: blur(10px);z-index: -1"></div>
          <el-button style="width: 180px" class="uploadWrapper button-style-main" @click="addMiniAppQrcode"><i class="el-icon-plus"></i>添加小程序二维码</el-button>
        </div>
      </div>

      <qrCode v-if="this.downloadCodeImageArray.length > 0"
              :downloadCodeImages="downloadCodeImageArray"
              :appId="this.appInfo.appId"
              @deleteQrcodeSuccess="deleteQrcodeSuccess"
      >

      </qrCode>

      <el-dialog
        title="创建小程序下载二维码"
        :visible.sync="showCreateQrCodeInfo"
        width="30%"
        center>
        <el-form ref="form" :model="qrCodeInfo" label-width="80px">
          <el-form-item label="scene">
            <el-input v-model="qrCodeInfo.scene" placeholder="场景参数列如authcode=xxxx&match=xxxx"></el-input>
          </el-form-item>
          <el-form-item label="page">
            <el-input v-model="qrCodeInfo.page" placeholder="小程序入口页面"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="qrCodeInfo.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showCreateQrCodeInfo = false">取 消</el-button>
          <el-button type="primary" @click="clickSure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
  import * as MiniApi from '../../api/moudle/miniApi'
  import { getUserTeam } from '../../mgr/userMgr'
  import MiniAppDetailHeader from './miniAppDetailHeader.vue'
  import QrCode from './qrCode.vue'

  export default {
    components: {
      MiniAppDetailHeader, QrCode
    },
    data() {
      return {
        appInfo: {},
        showCreateQrCodeInfo: false,
        qrCodeInfo: {
          scene: '',
          page: '',
          remark: '',
          teamId: ''
        },
        downloadCodeImageArray: []
      }
    },
    created() {
      this.$nextTick(() => {
        // 放置浏览器刷新菜单变化
        this.bus.$emit('miniAppDetail')
        this.userteam = getUserTeam()
        this.getAppDetailData()
      })
    },
    methods: {
      getAppDetailData() {
        MiniApi.getAppDetail(this.userteam._id, this.$route.params.appId).then((res) => {
          console.log(res)
          this.appInfo = res.data
          this.downloadCodeImageArray = this.appInfo.downloadCodeImage
          this.bus.$emit('miniAppDetail', this.appInfo.appName)
        }, reject => {
          this.$message.error(reject)
        })
      },
      addMiniAppQrcode() {
        this.showCreateQrCodeInfo = true
      },
      clickSure() {
        if (this.qrCodeInfo.scene === '') {
          this.$message.error('请输入scene')
          return
        }
        if (this.qrCodeInfo.page === '') {
          this.$message.error('请输入page')
          return
        }
        let body = {
          appId: this.appInfo.appId,
          scene: this.qrCodeInfo.scene,
          page: this.qrCodeInfo.page,
          remark: this.qrCodeInfo.remark,
          teamId: this.userteam._id
        }
        MiniApi.getQrCode(body).then((res) => {
          console.log(res)
          this.downloadCodeImageArray = res.data.downloadCodeImage || []
          this.showCreateQrCodeInfo = false
        }, reject => {
          this.$message.error(reject)
        })
      },
      deleteQrcodeSuccess() {
        this.getAppDetailData()
      }
    }
  }
</script>

<style lang="scss">

  @import "../../common/scss/base";

  .miniAppDetail-wrapper-applist-header {
    margin-top: 20px;
  }
</style>
