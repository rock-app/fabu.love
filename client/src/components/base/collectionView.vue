<template>
  <div class="collectionView-wrapper">
    <ul class="collectionView-wrapper-ul">
      <li v-for="(item, index) in this.dataArr" :key="index" class="itemWrapper">
        <i :class="item.platform === 'ios' ? 'icon-ic_ios':'icon-ic_android'" class="appItem-platform"></i>
        <img class="appItem-icon" v-if="item.icon" v-lazy="getIcon(item)" alt="" @click="gotoAppDetail(item)">

        <div class="appItem-info">
          <div class="appItem-info-namewrapper">
            <p class="nowrap" @click="gotoAppDetail(item)">{{item.appName}}</p>
          </div>
          <table style="width: 100%;table-layout: fixed;margin-top: 24px">
            <tr>
              <td class="appItem-info-title">短链接:</td>
              <td>
                <div class="appItem-info-appInfo nowrap" v-html="getShortUrl(item)"></div>
              </td>
            </tr>
            <tr>
              <td class="appItem-info-title">PackageName:</td>
              <td>
                <div class="appItem-info-appInfo nowrap">{{item.bundleId}}</div>
              </td>
            </tr>
            <tr>
              <td class="appItem-info-title">最新版本:</td>
              <td>
                <div class="appItem-info-appInfo nowrap" v-html="item.lastVersionCode"></div>
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
      return {}
    },
    created() {},
    methods: {
      gotoAppDetail(item) {
        this.$emit('gotoAppDetail', item)
      },
      getIcon(item) {
        return `${this.axios.defaults.baseURL}${item.icon}`
      },
      getShortUrl(item) {
        return `${this.axios.defaults.baseURL}${item.shortUrl}`
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
    height: 336px;
    background-color: white;
    margin-top: 20px;
    width: 23%;
    text-align: center;
    transition: 0.5s;
    &:nth-child(2n-1) {
      margin-right: 2.6%;
    }
    &:nth-child(4n-2) {
      margin-right: 2.6%;
    }
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
    background-color: red;
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
  }
  .appItem-info-appInfo {
    font-size: 10px;
    color: #333;
    max-width: 100%;
    line-height: 25px;
    text-align: left;
  }
</style>
