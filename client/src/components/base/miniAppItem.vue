<template>
  <div class="collectionView-wrapper">
    <ul class="collectionView-wrapper-ul">
      <li v-for="(item, index) in this.dataArr" :key="index" class="itemWrapper">

        <img class="appItem-icon" src="../../assets/miniicon.png" @click="gotoAppDetail(item)">

        <div class="appItem-info">
          <div class="appItem-info-namewrapper">
            <p class="nowrap" @click="gotoAppDetail(item)">{{item.appName}}</p>
          </div>
          <table style="width: 100%;table-layout: fixed;margin-top: 24px">
            <tr>
              <td class="appItem-info-title">AppId:</td>
              <td>
                <div class="appItem-info-appInfo nowrap" v-html="item.appId"></div>
              </td>
            </tr>
            <tr>
              <td class="appItem-info-title">AppSecret:</td>
              <td>
                <div class="appItem-info-appInfo nowrap">{{(item.appSecret.slice(0, 5) + '******')}}</div>
              </td>
            </tr>
          </table>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      // 每排的间距
      minimumLineSpacing: {
        type: Number
      },
      // 每列的间距
      minimumInteritemSpacing: {
        type: Number
      },
      dataArr: {
        type: Array
      }
    },
    data() {
      return {
      }
    },
    computed: {
    },
    created() {
    },
    methods: {
      gotoAppDetail(item) {
        this.$emit('gotoAppDetail', item)
      },
      getIcon(item) {
        return `${this.axios.defaults.baseURL}${item.icon}`
      },
      getShortUrl(item) {
        return `${this.axios.defaults.baseURL}${item.shortUrl}`
      },
      clickEditorBtn(item) {
        this.$emit('gotoAppDetail', item)
      },
      clickPreviewBtn(item) {
        const {href} = this.$router.resolve({
          name: 'AppPreView',
          path: '/',
          params: { 'id': item.shortUrl }
        })
        window.open(href, '_blank')
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";
  .collectionView-wrapper {
    width: 100%;
  }
  .collectionView-wrapper-ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .collectionView-wrapper .itemWrapper {
    position: relative;
    padding-bottom: 24px;
    background-color: white;
    margin-top: 20px;
    width: 264px;
    text-align: center;
    border-radius: 4px ;
    transition: 0.5s;
    margin-right: 2.6%;
    /*&:nth-child(2n-1) {*/
    /*margin-right: 2.6%;*/
    /*}*/
    /*&:nth-child(4n-2) {*/
    /*margin-right: 2.6%;*/
    /*}*/
  }
  .itemWrapper:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(0,0,0,.1);
  }
  .itemWrapper:hover .appItem-info-namewrapper p {
    color: #000;
  }
  .collectionView-wrapper .itemWrapper .appItem-platform{
    position: absolute;
    left: -2px;
    top: 24px;
    width: 52px;
    height: 38px;
    background-size: 52px 38px;
  }
  .collectionView-wrapper .itemWrapper .appItem-platform-ios {
    background-image: url("../../assets/tag_ios.png");
  }
  .collectionView-wrapper .itemWrapper .appItem-platform-android {
    background-image: url("../../assets/tag_android.png");
  }
  .itemWrapper .appItem-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    margin-top: 24px;
    cursor: pointer;
  }
  .itemWrapper .appItem-info {
    margin-top: 24px;
    overflow: hidden;
  }
  .appItem-info-namewrapper p {
    font-size: 18px;
    cursor: pointer;
    display: inline-block;
    color: $mainTitleColor;
    font-family: "PingFang SC";
    vertical-align: top;
  }
  .appItem-info-namewrapper p:hover{
    color: #000;
  }
  .appItem-info-title {
    font-size: 10px;
    color: #999;
    text-align: right;
    padding-right: 10px;
    width: 40%;
    height: 25px;
  }
  .appItem-info-appInfo {
    font-size: 10px;
    color: #333;
    max-width: 100%;
    line-height: 25px;
    text-align: left;
  }
  .collectionView-wrapper-ul .itemWrapper button {
    width: 36px;
    height: 36px;
    margin-top: 36px;
    float: right;
    border-color: #ccc;
    position: relative;
    overflow: hidden;
  }
  .collectionView-wrapper-ul .itemWrapper button i:before {
    color: #aaa;
  }
  .collectionView-wrapper-ul .itemWrapper button span {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    line-height: 36px;
    background-color: white;
    opacity: 0;
  }
  .collectionView-wrapper-ul .itemWrapper button:hover {
    border-color: $mainColor;
  }
  .collectionView-wrapper-ul .itemWrapper button span:hover {
    opacity: 1;
  }
  .collectionView-wrapper-ul .itemWrapper .editor {
    margin-right: 12px;
  }
  .collectionView-wrapper-ul .itemWrapper .preview {
    margin-right: 24px;
  }
</style>
