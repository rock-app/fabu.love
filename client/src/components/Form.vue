<template>
  <div class="form">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-row>
        <el-col :span="6">
          <el-form-item label="应用平台标志">
            <el-select v-model="form.platform">
              <el-option label="无限制" value="0"></el-option>
              <el-option label="Android" value="1"></el-option>
              <el-option label="IOS" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="应用Id">
            <el-input v-model="form.appId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="应用名称">
            <el-input v-model="form.appName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="版本号">
            <el-input v-model="form.version"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="版本名称">
            <el-input v-model="form.versionName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="版本状态">
            <el-select v-model="form.state">
              <el-option label="无限制" value="0"></el-option>
              <el-option label="正常" value="1"></el-option>
              <el-option label="关闭" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="类型">
            <el-input v-model="form.type"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="文件名称">
            <el-input v-model="form.fileName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="更新方式">
            <el-select v-model="form.updateWay">
              <el-option label="无限制" value="0"></el-option>
              <el-option label="静默更新" value="1"></el-option>
              <el-option label="强制更新" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="下载方式">
            <el-select v-model="form.downloadWay">
              <el-option label="无限制" value="0"></el-option>
              <el-option label="全量" value="1"></el-option>
              <el-option label="增量" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="onClear">重置</el-button>
            <el-button type="success" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import { createQueryParam } from '../model/QueryParam'
  import Bus from '../common/js/bus'

  export default {
    data() {
      return {
        form: {
          platform: '',
          appId: '',
          appName: '',
          version: '',
          versionName: '',
          state: '',
          type: '',
          fileName: '',
          updateWay: '',
          downloadWay: ''
        }
      }
    },
    methods: {
      onClear() {
        this.form = {
          platform: '',
          appId: '',
          appName: '',
          version: '',
          versionName: '',
          state: '',
          type: '',
          fileName: '',
          updateWay: '',
          downloadWay: ''
        }
      },
      onSubmit() {
        let params = createQueryParam(this.form)
        console.log(params)
        Bus.$emit('startQuery', params)
      }
    }
  }
</script>

<style>
  .form {
    margin-bottom: 30px;
    padding: 30px 20px;
    background-color: white;
  }

  .el-select {
    width: 100%;
  }

</style>
