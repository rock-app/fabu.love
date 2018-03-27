<template>
  <div class="appVersion-wrapper">
    <!--头部-->
    <div class="detail-content-top">
      <span class="icon-ic_ios"></span>版本信息
    </div>
    <!--内容-->
    <el-table
      :data="dataArr"
      style="width: 100%"
      stripe
      >
      <el-table-column
        prop="versionStr"
        label="版本"
      >
      </el-table-column>
      <el-table-column
        label="更新时间"
        width="120"
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
        label="下载次数">
        <template slot-scope="scope">
          <p style="display: inline-block" v-html="getDownLoadCount(scope.row.downloadCount)"></p>/<span style="color: #9B9B9B;display: inline-block" v-html="getAllowDownLoadCount(scope.row.strategy)"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="changelog"
        label="更新日志">
      </el-table-column>
      <el-table-column
        label="更新策略"
        width="180">
        <template slot-scope="scope">
          <div class="tabletitle">
            更新方式：<span class="tablecontent" v-if="scope.row.strategy.updateMode" v-html="scope.row.strategy.updateMode"></span>
          </div>
          <div class="tabletitle">
            限制次数：<span class="tablecontent" v-html="scope.row.strategy.downloadCountLimit ? scope.row.strategy.downloadCountLimit:'无限制'"></span>
          </div>
          <div class="tabletitle">
            限制ip：<span class="tablecontent" v-if="scope.row.strategy.blackIpList.length>0">{{scope.row.strategy.blackIpList[0]}}等{{scope.row.strategy.blackIpList.length}}个</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <button class="appversion-elButton">编辑</button>
          <button class="appversion-elButton" @click="handleClick(scope.row)">预览</button>
          <button class="appversion-elButton">删除</button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import {getUserTeam} from '../../mgr/userMgr'

  export default {
    props: {
      appId: {
        type: String
      },
      appName: {
        type: String
      },
      platform: {
        type: String
      }
    },
    components: {},
    data() {
      return {
        isFix: false,
        dataArr: [],
        showInDownLoadPage: false,
        currentPage: 0,
        userteam: {}
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
    created() {
      this.$watch('showInDownLoadPage', (newValue) => {
        console.log(newValue)
      })
      this.$nextTick(() => {
        this.userteam = getUserTeam()
        this.getAppVersionListData()
      })
    },
    methods: {
      getAppVersionListData() {
        AppResourceApi.getAppVersionList(this.userteam._id, this.appId, this.currentPage).then((res) => {
          console.log(res)
          this.dataArr = res.data
          this.dataArr = this.dataArr.concat(res.data)
          this.dataArr = this.dataArr.concat(res.data)
          this.dataArr = this.dataArr.concat(res.data)
          this.dataArr = this.dataArr.concat(res.data)
        }, reject => {

        })
      },
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
      },
      clickEditorBtn(index) {
        this.dataArr[index].isEditor = true
      },
      clickCancel(index) {
        this.dataArr[index].isEditor = false
      },
      clickSave(index) {

      },
      changeSwitch(index) {
        console.log(index)
      },
      clickPreViewBtn(item) {
        const {href} = this.$router.resolve({
          name: 'AppPreView',
          query: {'appId': item.appId, 'versionId': item._id, 'teamId': this.userteam._id, 'platform': this.platform, 'appName': this.appName}
        })
        window.open(href, '_blank')
      },
      // 发布应用
      releaseApp(item) {
        AppResourceApi.releaseApp(this.userteam._id, this.appId, item._id, item.versionCode, true).then((res) => {
          console.log(res)
        }, reject => {

        })
      },
      handleClick(row) {
        console.log(row)
      },
      getCreatTime(date) {
        let releaseDate = new Date(date)
        return `${releaseDate.getFullYear()}-${releaseDate.getMonth() + 1}-${releaseDate.getDate()}`
      },
      getAppSize(size) {
        return `${(size / 1024 / 1024).toFixed(1)}M`
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
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

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
    width: 48px;
    height: 24px;
    font-size: 12px;
    border: solid 1px #D5DFED;
    color: #D5DFED;
    border-radius: 12px;
    margin-right: 6px;
  }
</style>
