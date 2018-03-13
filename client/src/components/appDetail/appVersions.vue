<template>
  <div class="appVersion-wrapper">
    <!--头部-->
    <div class="appversion-header">
      <div class="appversion-header-leftLine">
        <div class="appversion-header-leftLine-dot"></div>
        <div class="appversion-header-leftLine-line"></div>
      </div>
      <div class="appversion-header-right">
        <el-form ref="form">
          <el-form-item class="appversion-header-form" label="版本更新">
            <button type="button" class="appversion-header-backbtn">回退</button>
          </el-form-item>
          <el-form-item class="appversion-header-form-address" label="商店地址：">
            <input :disabled="!this.isFix" :style="setBackgroudColor" type="text" placeholder="未填写">
            <button type="button" @click="clickFixBtn" v-html="this.isFix ? `保存`:`修改`"></button>
            <button type="button" @click="clickCancelBtn" style="margin-left: 3px" v-show="this.isFix">取消</button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--内容-->
    <div class="appversion-versionList">
      <ul style="position: relative">
        <li v-for="(item, index) in dataArr" :key="index" class="appversion-versionList-item">
          <div class="appversion-versionList-left-iconWrapper">
            <img src="../../assets/uploadVersion.png" alt="">
          </div>
          <div class="appversion-versionList-left-line"></div>
          <div class="appversion-versionList-right">
            <div class="appversion-versionList-itemtitle" v-html="item.a"></div>
            <div class="appversion-versionList-itemInfo">
              <span>21212121212</span>
              <span class="versionType">企业版</span>
              <span>XC:com.hd.123.com-sahnghaiasasasasasasasasas</span>
            </div>
            <div class="appversion-versionList-itemBottom" v-show="!item.isEditor">
              <el-button round @click="clickEditorBtn(index)">编辑</el-button>
              <el-button round><i class="el-icon-upload el-icon--left"></i>10.36M</el-button>
              <el-button @click="clickPreViewBtn" round><i class="icon-ic_preview"></i>预览</el-button>
              <el-button round><i class="el-icon-upload el-icon--left"></i>标记上线</el-button>
              <el-switch
                style="margin-left: 15px"
                v-model="showInDownLoadPage"
                active-color="#F8BA0B"
                inactive-color="#999"
                @change="changeSwitch(index)"
              >
              </el-switch><span style="color: #999; font-size: 15px;vertical-align: middle;margin-left: 10px">显示在下载页面</span>
            </div>

            <!--更新日志的展示-->
            <div class="appversion-versionList-updateNote" v-show="item.isEditor">
              <textarea autofocus="true" name="" id="" placeholder="更新日志"></textarea>
              <div style="text-align: right">
                <button class="appversion-versionList-updateNote-cancel" @click="clickCancel(index)">取消</button>
                <button class="appversion-versionList-updateNote-save" @click="clickSave(index)">保存</button>
              </div>
            </div>
          </div>
        </li>
        <div class="appversion-versionList-itemFooter" @click="loadMore">显示更多版本</div>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
  export default {
    components: {ElButton},
    data() {
      return {
        isFix: false,
        dataArr: [{'a': '1.1.0', 'isEditor': false}, {'a': '1.1.0', 'isEditor': false}, {'a': '1.1.0', 'isEditor': false}, {'a': '1.1.0', 'isEditor': false}, {'a': '1.1.0', 'isEditor': false}, {'a': '1.1.0', 'isEditor': false}, {'a': '1.1.0', 'isEditor': false}, {'a': '1.1.0', 'isEditor': false}],
        showInDownLoadPage: false
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
    },
    methods: {
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
      clickPreViewBtn() {
        const {href} = this.$router.resolve({
          name: 'AppPreView'
        })
        window.open(href, '_blank')
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .appVersion-wrapper {
    padding: 80px 15%;
  }
  .appversion-header {
  }
  .appversion-header-leftLine {
    display: inline-block;
  }
  .appversion-header-leftLine-dot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #666;
  }
  .appversion-header-leftLine-line {
    width: 1px;
    height: 125px;
    background-color: #ccc;
    margin-left: 4px;
  }
  .appversion-header-right {
    width: 80%;
    display: inline-block;
    margin-left: 50px;
    vertical-align: top;
  }
  .appversion-header-form {
    margin-top: -13px;
  }
  .appversion-header-form .el-form-item__label {
    font-size: 14px;
    font-weight: bold;
    text-align: left;
  }
  .appversion-header-right .appversion-header-form-address .el-form-item__label {
    font-size: 14px;
    text-align: left;
  }
  .appversion-header-right .appversion-header-form-address input {
    width: 400px;
    height: 40px;
    border: solid 1px #999;
    border-radius: 5px;
    background-color: $paleGrey;
    padding-left: 8px;
    outline: 0;
  }
  .appversion-header-right .appversion-header-form-address button {
    width: 50px;
    height: 40px;
    border: solid 1px #999;
    color: #999;
    border-radius: 4px;
    background-color: $paleGrey;
    vertical-align: top;
    margin-left: 10px;
  }
  .appversion-header-backbtn {
    background-color: $paleGrey;
    width: 80px;
    height: 30px;
    margin-left: 20px;
    border-radius: 15px;
    color: #666;
  }
  /*列表的样式*/
  .appversion-versionList-item {
    position: relative;
    padding-bottom: 60px;
  }
  .appversion-versionList-left-iconWrapper {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: solid 1px #999;
    background-color: $paleGrey;
    text-align: center;
    position: absolute;
    left: -20px;
  }
  .appversion-versionList-left-iconWrapper img {
    width: 25px;
    height: 25px;
    margin-top: 12.5px;
  }
  .appversion-versionList-left-line {
    width: 1px;
    background-color: #ccc;
    position: absolute;
    top: 50px;
    left: 5px;
    bottom: 0px;
  }
  .appversion-versionList-right {
    display: inline-block;
    vertical-align: top;
    margin-left: 65px;
  }
  .appversion-versionList-itemtitle {
    font-size: 18px;
    font-weight: bold;
    margin-top: 5px;
  }
  .appversion-versionList-itemInfo {
    font-size: 10px;
    color: #999;
    margin-top: 15px;
  }
  .versionType:before {
    content: "·";
    color: #999;
    margin-left: 8px;
    margin-right: 8px;
  }
  .versionType:after {
    content: "·";
    color: #999;
    margin-left: 8px;
    margin-right: 8px;
  }
  .appversion-versionList-itemBottom {
    margin-top: 20px;
  }
  .appversion-versionList-itemBottom .el-button {
    background-color: $paleGrey !important;
    color: #999 !important;
  }
  .appversion-versionList-itemFooter {
    position: absolute;
    width: 160px;
    height: 40px;
    left: -20px;
    border-radius: 20px;
    border: solid 1px #999;
    font-size: 15px;
    color: #999;
    text-align: center;
    line-height: 40px;
  }
  .appversion-versionList-updateNote textarea {
    width: 100%;
    height: 100px;
    border: solid 1px #ccc;
    font-size: 15px;
    outline: 0;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 20px;
    padding: 8px 8px;
    margin-bottom: 10px;
    resize: none;
  }
  .appversion-versionList-updateNote-save {
    width: 60px;
    height: 35px;
    border-radius: 17.5px;
    background-color: #F8BA0B;
    border-color: transparent;
    font-size: 16px;
    color: white;
  }
</style>
