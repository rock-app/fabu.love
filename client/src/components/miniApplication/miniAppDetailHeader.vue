<template>
  <div class="miniAppDetail-wrapper">
    <div class="detail-header">
      <div class="detail-header-top">
        <!--v-lazy="getIconUrl()"-->
        <img class="appicon" src="../../assets/miniicon.png">
        <p class="appname">{{this.appInfo.appName}}</p>
        <button class="delete button-style-border" @click="delectMiniApp">删除</button>
      </div>
    </div>

    <div class="detail-header-bottom">
      <ul>
        <li v-for="(item, index) in this.headerOperationData" :key="index" class="itemwrapper">
          <div class="top">
            <p class="title">{{item}}</p>
          </div>
          <div class="subWrapper" v-if="appInfo._id">
            <p class="subtitle">{{subTitleArr[index]}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as MiniApi from '../../api/moudle/miniApi'
  import { getUserTeam } from '../../mgr/userMgr'

  export default {
    props: {
      appInfo: {
        type: Object
      }
    },
    data() {
      return {
        headerOperationData: [],
        subTitleArr: []
      }
    },
    components: {
    },
    created() {
      this.$nextTick(() => {
        this.team = getUserTeam()
        this.subTitleArr = [this.appInfo.appId, (this.appInfo.appSecret.slice(0, 5) + '******')]
        this.headerOperationData = ['AppId', 'AppSecret']
      })
    },
    methods: {
      getIconUrl() {
        return `${this.axios.defaults.baseURL}${this.appInfo.icon}`
      },
      delectMiniApp(item) {
        this.$confirm('确认删除？')
          .then(_ => {
            MiniApi.delectApp(this.team._id, this.appInfo._id).then((res) => {
              this.$message.success('删除成功')
              this.$router.go(-1)
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

  .miniAppDetail-wrapper .detail-header {
    width: 100%;
    background-color: $paleGrey;
    margin-top: 24px;
  }
  .miniAppDetail-wrapper .detail-header-top {
    width: 100%;
    height: 120px;
    margin-bottom: 1px;
    background-color: white;
  }
  .miniAppDetail-wrapper .detail-header-top {
    position: relative;
  }
  .miniAppDetail-wrapper .detail-header-top .appicon {
    position: absolute;
    top: 24px;
    left: 24px;
    width: 72px;
    height: 72px;
    background-size: cover;
    border-radius: 8px;
  }
  .miniAppDetail-wrapper .detail-header-top .appname {
    position: absolute;
    top: 24px;
    left: 120px;
    line-height: 24px;
    font-size: 24px;
    font-family: "PingFang SC";
  }

  .miniAppDetail-wrapper .delete {
    float: right;
    width: 48px;
    border-color: $warmRed;
    color: $warmRed;
    margin-right: 20px;
    margin-top: 40px;
  }

  .miniAppDetail-wrapper .detail-header-bottom {
    background-color: white;
  }
  .miniAppDetail-wrapper .detail-header-bottom .itemwrapper {
    display: inline-block;
    width: 33%;
    height: 108px;
    vertical-align: top;
  }
  .miniAppDetail-wrapper .detail-header-bottom .itemwrapper .top {
    border-left: solid 4px $mainColor;
    width: 100%;
    height: 24px;
    margin-left: 24px;
    margin-top: 24px;
  }
  .miniAppDetail-wrapper .detail-header-bottom .itemwrapper .top .title {
    font-size: 18px;
    line-height: 24px;
    margin-left: 8px;
    font-family: "PingFang SC";
    color: $mainTitleColor;
  }
  .miniAppDetail-wrapper .detail-header-bottom .itemwrapper .subWrapper {
    margin-left: 36px;
    margin-top: 12px;
    height: 48px;
    width: calc(100% - 36px);
  }
  .miniAppDetail-wrapper .detail-header-bottom .itemwrapper .subWrapper .subtitle {
    font-size: 14px;
    color: $subTitleColor;
    line-height: 16px;
    word-wrap: break-word;
    word-break: normal;
    user-select: text;
  }
</style>
