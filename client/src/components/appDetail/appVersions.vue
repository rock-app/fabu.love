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
          <button class="appversion-elButton" @click="clickEditor(scope.row)">编辑</button>
          <button class="appversion-elButton" @click="clickPreview(scope.row)">预览</button>
          <button class="appversion-elButton" @click="clickDelect(scope.row)">删除</button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import {getUserTeam, getUserId} from '../../mgr/userMgr'

  export default {
    props: {
      appId: {
        type: String
      },
      shortUrl: {
        type: String
      },
      platform: {
        type: String
      }
    },
    components: {},
    data() {
      return {
        dataArr: [],
        userteam: {}
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
        AppResourceApi.getAppVersionList(this.userteam._id, this.appId, this.currentPage).then((res) => {
          console.log(res)
          this.dataArr = res.data
        }, reject => {

        })
      },
      clickEditor(item) {

      },
      clickPreview(item) {
        const {href} = this.$router.resolve({
          name: 'AppPreView',
          path: '/',
          params: { 'id': this.shortUrl }
        })
        window.open(href, '_blank')
      },
      clickDelect(item) {
        this.$confirm('确认删除？')
          .then(() => {
            console.log(this.userteam._id)
            console.log(getUserId())
            console.log(item._id)

            AppResourceApi.delectAppVersion(this.userteam._id, this.appId, item._id).then((res) => {
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
        AppResourceApi.releaseApp(this.userteam._id, this.appId, item._id, item.versionCode, true).then((res) => {
          console.log(res)
        }, reject => {

        })
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
