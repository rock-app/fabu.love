<template>
  <div>
    <div class="table-title">搜索结果</div>
    <el-table
      v-loading="showLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="datas"
      border
      size="mini"
      @sort-change="sortChange"
      class="app-table">

      <el-table-column
        align="center"
        label="平台"
        width="80">
        <template slot-scope="scope">
          <div class="platform-content">
            <img v-if="datas[scope.$index].platform==='android'" class="platform-img" src="../assets/android.png"/>
            <img v-else class="platform-img" src="../assets/ios.png"/>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="应用名称"
        width="200">
      </el-table-column>

      <el-table-column
        prop="version"
        align="center"
        label="版本"
        width="80">
      </el-table-column>

      <el-table-column
        label="描述"
        width="280">
        <template slot-scope="scope">
          <div class="describe">{{datas[scope.$index].describe}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="state"
        align="center"
        label="状态"
        width="60">
      </el-table-column>

      <el-table-column
        align="center"
        label="是否发布"
        width="100">
        <template slot-scope="scope">
          <div>{{datas[scope.$index].isRelease ? '是' : '否'}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="type"
        align="center"
        label="类型"
        width="100">
      </el-table-column>

      <el-table-column
        prop="downloadCounts"
        align="center"
        label="下载次数"
        width="120"
        sortable="custom">
      </el-table-column>

      <el-table-column
        prop="updateTime"
        align="center"
        label="更新时间"
        width="150"
        sortable="custom">
        <template slot-scope="scope">
          <div>{{getDateStr(datas[scope.$index].updateTime)}}</div>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleDelete(scope.$index, scope.row)">下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="table-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryParams.page+1"
      :page-sizes="[10, 15, 20, 25]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script type="text/ecmascript-6">
  import * as net from '../api/net'
  import { dateFormat } from '../common/js/date'
  import Bus from '../common/js/bus'

  export default {
    created() {
      this.getAppList()

      Bus.$on('startQuery', params => {
        this.queryParams.page = 0
        this.queryBody = params
        this.getAppList()
      })
    },
    data() {
      return {
        datas: [],
        queryParams: {
          'page': 0,
          'pageSize': 10,
          'isDesc': true,
          'sortKey': 'updateTime'
        },
        queryBody: {},
        showLoading: false,
        total: 0,
        pageCount: 0
      }
    },
    methods: {
      getAppList() {
        this.showLoading = true
        net.getAppList(this.queryParams, this.queryBody).then(res => {
          console.log(res)
          this.showLoading = false
          this.datas = res.applist
          this.total = res.total
          this.pageCount = res.pageCount
        }, reject => {
          console.log(reject)
        })
      },
      sortChange(body) {
        console.log(body)
        this.queryParams.sortKey = body.prop
        this.queryParams.isDesc = body.order === 'descending'
        this.getAppList()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.queryParams.page = 0
        this.queryParams.pageSize = val
        this.getAppList()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.queryParams.page = val - 1
        this.getAppList()
      },
      handleEdit(index, row) {
        console.log(index, row)
      },
      handleDelete(index, row) {
        console.log(index, row)
      },
      isReleaseStr(bol) {
        return bol ? '是' : '否'
      },
      getDateStr(date) {
        return dateFormat(new Date(date))
      }
    }
  }
</script>

<style>

  .table-title {
    height: 45px;
    background-color: deepskyblue;
    padding-left: 20px;
    line-height: 45px;
    color: white;
  }

  .el-table th {
    color: #333333;
    font-size: 15px;
  }

  .el-table--mini th {
    padding: 3px 0;
  }

  .el-table th .cell {
    font-weight: bold !important;
  }

  .el-table tr {
    color: #333333;
    font-size: 13px;
  }

  .table-pagination {
    background-color: white;
    height: 50px;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
  }

  .platform-content {
    height: 100%;
    width: 100%;
    align-items: center;
    display: flex;
    display: -webkit-flex;
    justify-content: center
  }

  .platform-img {
    width: 15px;
    height: 15px;
  }

  .describe {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

</style>
