<template>
  <div class="personalInfo-wrapper">
    <ul>
      <li class="emailWrapper">
        <p class="emailTitle">邮箱</p><span class="email">1212121@qq.com</span>
      </li>
      <li class="personalInfoItem" v-for="(item, index) in dataArr" :key="index">
        <div class="itemNoEditor" v-show="!item.isEditor">
          <p class="title">{{item.title}}</p>
          <span class="content">{{item.subTitle}}</span>
          <span class="icon-ic_editor" @click="clickEditor(item)"></span>
        </div>

        <!--手机号的编辑状态-->
        <div class="phoneEditorWrapper" v-show="item.isEditor && index === 0">
          <div class="top">
            <p>手机</p>
            <input type="text">
            <button>保存</button>
          </div>
          <div class="code">
            <input type="text" placeholder="验证码">
            <button>获取验证码</button>
          </div>
        </div>
        <!--qq的编辑状态-->
        <div class="phoneEditorWrapper" v-show="item.isEditor && index === 1">
          <p style="display: inline-block;">QQ</p>
          <input style="margin-left: 15px" type="text" placeholder="可选">
          <button>保存</button>
        </div>
        <!--公司的编辑状态-->
        <div class="phoneEditorWrapper" v-show="item.isEditor && index === 2">
          <p style="display: inline-block;">公司</p>
          <input style="margin-left: 10px" type="text" placeholder="可选">
          <button @click="clickSaveCompany">保存</button>
        </div>
        <!--职位-->
        <div class="phoneEditorWrapper" v-show="item.isEditor && index === 3">
          <p style="display: inline-block;">职位</p>
          <input style="margin-left: 10px" type="text" placeholder="可选">
          <button @click="clickSaveEmployee">保存</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        dataArr: [
          {'title': '手机', 'subTitle': '1332323232', 'isEditor': false},
          {'title': 'QQ', 'subTitle': 'QQ', 'isEditor': false},
          {'title': '公司', 'subTitle': '公司', 'isEditor': false},
          {'title': '职位', 'subTitle': '职位', 'isEditor': false}
        ]
      }
    },
    created() {
    },
    methods: {
      clickEditor(item) {
        item.isEditor = true
      },
      clickSaveCompany() {

      },
      clickSaveEmployee () {

      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .personalInfo-wrapper {
    width: 400px;
    margin: 0 auto;
    padding-bottom: 100px;
  }
  .personalInfo-wrapper .email {
    display: inline-block;
    margin-left: 10px;
    font-size: 13px;
    color: #999;
  }
  .personalInfo-wrapper .emailTitle {
    display: inline-block;
    font-size: 14px;
  }
  .emailWrapper {
    margin-top: 50px;
    margin-bottom: 30px;
    text-align: left;
    padding: 0 10px;
  }
  .personalInfoItem {
    margin-bottom: 30px;
  }
  .personalInfoItem .itemNoEditor {
    height: 40px;
    border-bottom: solid 1px #ccc;
    text-align: left;
    padding: 0 10px;
  }
  .itemNoEditor .title {
    display: inline-block;
    font-size: 14px;
    margin-bottom: 5px;
  }
  .itemNoEditor .content {
    display: inline-block;
    margin-left: 10px;
    font-size: 13px;
    color: #999;
    margin-top: 20px;
  }
  .itemNoEditor .icon-ic_editor {
    float: right;
    margin-top: 20px;
  }
  .itemNoEditor .icon-ic_editor:before {
    color: $warmRed;
  }
  /*修改手机*/
  .phoneEditorWrapper {
    text-align: left;
    padding-left: 10px;
    font-size: 0px;
  }
  .phoneEditorWrapper p {
    display: inline-block;
    font-size: 14px;
  }
  .phoneEditorWrapper input {
    display: inline-block;
    width: 240px;
    height: 40px;
    box-sizing: border-box;
    border: solid 1px $warmRed;
    border-radius: 5px;
    padding: 0 8px;
    vertical-align: middle;
    font-size: 14px;
  }
  .phoneEditorWrapper button {
    display: inline-block;
    width: 100px;
    height: 40px;
    background-color: $warmRed;
    border-radius: 5px;
    color: white;
    font-size: 14px;
    margin-left: 5px;
    vertical-align: bottom;
    border-color: transparent;
  }
  .phoneEditorWrapper .top input {
    margin-left: 8px;
    width: 240px;
  }
  .phoneEditorWrapper .top button {
    vertical-align: top;
  }
  .phoneEditorWrapper .code input {
    margin-top: 8px;
    margin-left: 37px;
    border: solid 1px #999;
  }
</style>
