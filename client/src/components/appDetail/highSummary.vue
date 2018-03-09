<template>
  <div class="highSummary-wrapper">
    <div class="highSummary-wrapper-left">
      <ul>
        <li :class="getItemClass(item)" v-for="item in listTitle" :key="item" @click="clickSumaryItem(item)">
          {{item}}
        </li>
      </ul>
    </div>

    <div class="highSummary-wrapper-right">
      <p class="highSummary-wrapper-right-noData">暂无统计数据，请先   <span @click="clickMakeSummaryLink">生成统计链接</span></p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        listTitle: ['版本统计', '渠道统计', '活动统计', '链接统计'],
        currentItem: '版本统计'
      }
    },
    methods: {
      clickSumaryItem(item) {
        this.currentItem = item
      },
      getItemClass(item) {
        if (item === this.currentItem) {
          return 'highSummary-wrapper-leftLiActive'
        } else {
          return 'highSummary-wrapper-leftLiNomal'
        }
      },
      clickMakeSummaryLink() {

      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .highSummary-wrapper {
    padding: 80px 15%;
  }
  .highSummary-wrapper-left {
    display: inline-block;
  }
  .highSummary-wrapper-left li {
    height: 30px;
    font-size: 12px;
    list-style: disc;
  }
  .highSummary-wrapper-leftLiNomal {
    color: #999;
  }
  .highSummary-wrapper-leftLiActive{
    color: #333;
  }
  .highSummary-wrapper-right {
    display: inline-block;
  }
  .highSummary-wrapper-right-noData {
    font-size: 18px;
    color: #333;
    margin-top: 50px;
    margin-left: 300px;
  }
  .highSummary-wrapper-right-noData span {
    display: inline-block;
    width: 105px;
    height: 30px;
    background-color: #F8BA0B;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
  }
</style>
