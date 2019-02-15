<template>
    <div class="qrcode-wrapper">
      <ul class="qrcode-wrapper-ul">
        <li v-for="(item, index) in downloadCodeImages" :key="index" class="itemWrapper" @mouseenter="mouseenter(item, index)" @mouseleave="mouseleave(item, index)">
          <img class="qrcode-icon" v-lazy="getIcon(item)" :onerror="defaultImg">
          <div>
            <table style="width: 100%;table-layout: fixed;margin-top: 24px">
              <tr>
                <td class="appItem-info-title">scene:</td>
                <td>
                  <div class="appItem-info-appInfo nowrap" v-html="item.param"></div>
                </td>
              </tr>
              <tr>
                <td class="appItem-info-title">page:</td>
                <td>
                  <div class="appItem-info-appInfo nowrap">{{item.page}}</div>
                </td>
              </tr>
              <tr>
                <td class="appItem-info-title">备注:</td>
                <td>
                  <div class="appItem-info-appInfo nowrap">{{item.remark}}</div>
                </td>
              </tr>
            </table>
          </div>

          <i v-show="item.showDelete" class="el-icon-circle-close" @click="deleteQrCode(item)"></i>

        </li>
      </ul>
    </div>
</template>

<script type="text/ecmascript-6">
  import * as MiniApi from '../../api/moudle/miniApi'

  export default {
    props: {
      downloadCodeImages: {
        type: Array
      },
      appId: {
        type: String
      }
    },
    data() {
      return {
        defaultImg: 'this.src="' + require('../../assets/imgerror.png') + '"'
      }
    },
    created() {},
    methods: {
      getIcon(item) {
        console.log(`${this.axios.defaults.baseURL}${item.image}`)
        return `${this.axios.defaults.baseURL}${item.image}`
      },
      mouseenter(item, index) {
        item.showDelete = true
        this.$set(this.downloadCodeImages, index, item)
      },
      mouseleave(item, index) {
        item.showDelete = false
        this.$set(this.downloadCodeImages, index, item)
      },
      deleteQrCode(item) {
        this.$confirm('确认删除？')
          .then(_ => {
            let body = {
              appId: this.appId,
              codeId: item._id
            }
            MiniApi.deleteQrCode(body).then((res) => {
              this.$message.success('删除成功')
              this.$emit('deleteQrcodeSuccess')
            }, reject => {
              this.$message.error(reject)
            })
          })
          .catch(_ => {})
      }
    }
  }
</script>

<style lang="scss">
    @import "../../common/scss/base";

    .qrcode-wrapper {
      width: 100%;
    }
    .qrcode-wrapper-ul {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .qrcode-wrapper .itemWrapper {
      position: relative;
      padding-bottom: 12px;
      background-color: white;
      margin-top: 20px;
      width: 264px;
      text-align: center;
      border-radius: 4px ;
      transition: 0.5s;
      margin-right: 2.6%;
    }
    .qrcode-wrapper .itemWrapper:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 30px rgba(0,0,0,.1);
    }
    .qrcode-wrapper .itemWrapper:hover .appItem-info-namewrapper p {
      color: #000;
    }
    .qrcode-wrapper .itemWrapper .qrcode-icon {
      width: 264px;
      height: 264px;
      padding: 10px;
      box-sizing: border-box;
      overflow: hidden;
    }

  .qrcode-wrapper .appItem-info-title {
    line-height: 26px;
    height: 26px;
  }
  .qrcode-wrapper .appItem-info-appInfo {
    text-align: left;
  }
  .qrcode-wrapper .el-icon-circle-close {
    position: absolute;
    right: -6px;
    top: -6px;
    color: $warmRed;
  }
</style>
