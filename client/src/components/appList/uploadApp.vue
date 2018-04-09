<template>
  <div class="uploadApp-wrapper">
    <el-progress ref="progress" :stroke-width="30" class="uploadProgress" :percentage="progress" status="exception"></el-progress>
    <button class="uploadCancelBtn" @click="cancelUpload">取消上传</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Message } from 'element-ui'
  const axios = require('axios')

  export default {
    props: {
      appFile: {
        type: FileList
      },
      teamId: {
        type: String
      }
    },
    data() {
      return {
        progress: 0,
        source: null // 取消上传
      }
    },
    created() {
      this.$nextTick(() => {
        this.beginLoad()
      })
    },
    methods: {
      cancelUpload() {
        if (this.source) {
          this.source.cancel('取消上传')
        }
        this.$emit('closeUpload')
      },
      beginLoad() {
        const _this = this

        // 取消上传使用
        let cancelToken = axios.CancelToken
        _this.source = cancelToken.source()

        var data = new FormData()
        data.append('file', this.appFile[0])
        var config = {
          onUploadProgress: function(progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            _this.$nextTick(() => {
              _this.progress = percentCompleted
            })
          },
          cancelToken: _this.source.token
        }

        axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'

        axios.post(`api/apps/${_this.teamId}/upload`, data, config)
          .then(function (res) {
            Message({
              message: res.data.success ? '上传成功' : res.data.message,
              type: res.data.success ? 'success' : 'error'
            })
            _this.$emit('uploadSuccess')
          })
          .catch(function(err) {
            if (axios.isCancel(err)) {
              console.log('Request canceled', err.message)
              return
            }
            Message.error(err.response.data.message)
          })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .uploadApp-wrapper {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .uploadProgress {
    position: absolute;
    left: 10%;
    right: 10%;
    top: 50%;
  }
  .uploadApp-wrapper .uploadProgress .el-progress-bar__inner {
    background-color: $warmRed;
  }
  .uploadCancelBtn {
    position: absolute;
    left: 50%;
    margin-left: -40px;
    top: 60%;
    width: 80px;
    height: 50px;
    color: white;
    background-color: $warmRed;
    border-color: transparent;
    font-size: 15px;
  }
</style>
