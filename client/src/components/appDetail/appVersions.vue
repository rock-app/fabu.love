<template>
  <div class="appVersion-wrapper">
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
    <!--头部-->
    <div class="detail-content-top">
      <span class="icon-ic_ios"></span>版本信息
    </div>
    <!--内容-->
    <el-table
      :data="dataArr"
      style="width: 100%;box-sizing: border-box"
      stripe
      class="version-table"
      >
      <el-table-column
        width="60"
        label=""
        class="version-table-one"
      >
        <template slot-scope="scope">
          <i class="icon-ic_ios"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="versionStr"
        width="60"
        label="版本"
      >
      </el-table-column>
      <el-table-column
        label="更新时间"
        width="150"
      >
        <template slot-scope="scope">
          <p v-html="getCreatTime(scope.row.uploadAt)"></p>
        </template>
      </el-table-column>
      <el-table-column
        label="文件大小"
        width="120"
      >
        <template slot-scope="scope">
          <p v-html="getAppSize(scope.row.size)"></p>
        </template>
      </el-table-column>
      <el-table-column
        label="下载次数"
        width="120"
      >
        <template slot-scope="scope">
          <p style="display: inline-block" v-html="getDownLoadCount(scope.row.downloadCount)"></p>/<span style="color: #9B9B9B;display: inline-block" v-html="getAllowDownLoadCount(scope.row.strategy)"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="changelog"
        label="更新日志">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <button class="appversion-elButton" @click="releaseApp(scope.row)"><i class="icon-ic_ios"></i></button>
          <button class="appversion-elButton" @click="clickDownLoad(scope.row)"><i class="icon-ic_editor"></i></button>
          <button class="appversion-elButton" @click="clickEditor(scope.row)"><i class="icon-ic_editor"></i></button>
          <button class="appversion-elButton" @click="clickDelect(scope.row)"><i class="icon-ic_editor"></i></button>
        </template>
      </el-table-column>
    </el-table>

    <editorVersion v-if="this.showEditorVersion" @cancel="cancel" :versionInfo="this.versionInfo"></editorVersion>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import {getUserTeam} from '../../mgr/userMgr'
  import EditorVersion from './editorVersion.vue'

  export default {
    props: {
      appInfo: {
        type: Object
      },
      subTitleArr: {
        type: Array
      }
    },
    components: {
      EditorVersion
    },
    data() {
      return {
        headerOperationData: ['Bundle ID', '下载地址', 'App Key'],
        dataArr: [],
        userteam: {},
        showEditorVersion: false,
        versionInfo: {}
      }
    },
    computed: {
    },
    created() {
      this.$nextTick(() => {
        this.userteam = getUserTeam()
        this.getAppVersionListData()
      })
    },
    methods: {
      getAppVersionListData() {
        AppResourceApi.getAppVersionList(this.userteam._id, this.appInfo._id, this.currentPage).then((res) => {
          console.log(res)
          this.dataArr = res.data
        }, reject => {

        })
      },
      clickDownLoad(item) {

      },
      clickEditor(item) {
        this.showEditorVersion = true
        item.appName = this.appInfo.appName
        this.versionInfo = item
      },
      clickPreview(item) {
        const {href} = this.$router.resolve({
          name: 'AppPreView',
          path: '/',
          params: { 'id': this.appInfo.shortUrl }
        })
        window.open(href, '_blank')
      },
      clickDelect(item) {
        this.$confirm('确认删除？')
          .then(() => {
            AppResourceApi.delectAppVersion(this.userteam._id, this.appInfo._id, item._id).then((res) => {
              this.$message.success('删除成功')
              var index = this.dataArr.indexOf(item)
              this.dataArr.splice(index, 1)
              console.log(this.dataArr)
            }, reject => {
              this.$message.error(reject)
            })
          }).catch(() => {})
      },
      // 发布应用
      releaseApp(item) {
        AppResourceApi.releaseApp(this.userteam._id, this.appInfo._id, item._id, item.versionCode, true).then((res) => {
          console.log(res)
        }, reject => {

        })
      },
      getCreatTime(date) {
        let releaseDate = new Date(date)
        return `${releaseDate.getFullYear()}-${releaseDate.getMonth() + 1}-${releaseDate.getDate()}`
      },
      getAppSize(size) {
        return `${(size / 1024 / 1024).toFixed(2)}M`
      },
      getDownLoadCount(count) {
        if (count) {
          return count
        } else {
          return 0
        }
      },
      getAllowDownLoadCount(strategy) {
        if (strategy.downloadCountLimit) {
          return strategy.downloadCountLimit
        } else {
          return '不限'
        }
      },
      cancel() {
        this.showEditorVersion = false
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .appVersion-wrapper .detail-header-bottom {
    background-color: white;
  }
  .appVersion-wrapper .detail-header-bottom .itemwrapper {
    display: inline-block;
    width: 33%;
    height: 108px;
    vertical-align: top;
  }
  .appVersion-wrapper .detail-header-bottom .itemwrapper .top {
    border-left: solid 4px $mainColor;
    width: 100%;
    height: 24px;
    margin-left: 24px;
    margin-top: 24px;
  }
  .appVersion-wrapper .detail-header-bottom .itemwrapper .top .title {
    font-size: 18px;
    line-height: 24px;
    margin-left: 8px;
    font-family: "PingFang SC";
    color: $mainTitleColor;
  }
  .appVersion-wrapper .detail-header-bottom .itemwrapper .subWrapper {
    margin-left: 36px;
    margin-top: 12px;
    height: 48px;
    width: calc(100% - 36px);
  }
  .appVersion-wrapper .detail-header-bottom .itemwrapper .subWrapper .subtitle {
    font-size: 14px;
    color: $subTitleColor;
    line-height: 16px;
    word-wrap: break-word;
    word-break: normal;
  }
  .detail-content-top {
    width: 100%;
    height: 48px;
    background-color: white;
    color: $mainTitleColor;
    font-size: 16px;
    line-height: 48px;
    margin-top: 10px;
    padding-left: 24px;
    box-sizing: border-box;
  }
  .appVersion-wrapper .tabletitle {
    font-size: 12px;
    color: $subTitleColor;
    line-height: 16px;
  }
  .appVersion-wrapper .tablecontent {
    font-size: 12px;
    color: $mainTitleColor;
    line-height: 16px;
  }
  .appversion-elButton {
    width: 24px;
    height: 24px;
    font-size: 12px;
    border: solid 1px #D5DFED;
    color: #D5DFED;
    border-radius: 12px;
    margin-right: 6px;
  }
  .appVersion-wrapper .version-table .cell {
    text-align: center;
  }
</style>
