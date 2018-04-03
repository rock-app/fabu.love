<template>
  <div class="userMessage-wrapper" @click="cancel">
    <transition name="fadeRight">
      <div v-show="this.show" class="userMessage-wrapper-body" @click.stop="clickcontent">
        <div class="top">
          <button>清空消息</button>
          <div style="width: 100%;height: 1px;background-color: #eee;margin-top: 10px"></div>
        </div>
        <ul>
          <li class="messageItem" v-for="(item, index) in this.dataArr" :key="index">
            <span></span>
            <p class="canwrap content">121212121211212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121221212121212121212</p>
            <p class="timer">19:00</p>
          </li>
        </ul>
      </div>
    </transition>

  </div>
</template>

<script type="text/ecmascript-6">

  import {getUserInfo} from '../../mgr/userMgr'
  import Bus from '../../common/js/bus'

  export default {
    components: {
    },
    data() {
      return {
        show: false,
        userInfo: {},
        dataArr: ['']
      }
    },
    created() {
      setTimeout(() => {
        this.show = true
      }, 100)
      this.userInfo = getUserInfo()
    },
    computed: {
    },
    methods: {
      clickItem(item) {
        this.currentItem = item
      },
      cancel() {
        this.show = false
        setTimeout(() => {
          Bus.$emit('hiddenUserMessage')
        }, 500)
      },
      clickcontent() {}
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";

  .fadeRight-enter-active {
    transition: all .5s ease;
  }
  .fadeRight-leave-active {
    transition: all .5s ease;
  }
  .fadeRight-enter, .fadeRight-leave-to {
    transform: translateX(100%);
  }
  .userMessage-wrapper {
    position: fixed;
    top: 72px;
    left: 0px;
    bottom: 0px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 1000;
  }
  .userMessage-wrapper-body {
    float: right;
    width: 480px;
    height: 100%;
    margin-right: 0;
    background-color: white;
    box-shadow: 0 2px 6px rgba(120, 120, 120, 0.5);
    overflow: scroll;
  }
  .userMessage-wrapper-body .top {
    width: 100%;
    height: 60px;
    text-align: right;
  }
  .userMessage-wrapper-body .top button {
    height: 40px;
    line-height: 40px;
    margin-top: 10px;
    padding: 0px;
    margin-right: 10px;
  }
  .userMessage-wrapper-body .messageItem {
    display: flex;
    padding: 20px 10px;
  }
  .userMessage-wrapper-body .messageItem span {
    display: inline-block;
    width: 25px;
    height: 25px;
    background-image: url("../../assets/ic_about1.png");
    background-size: 25px 25px;
  }
  .userMessage-wrapper-body .messageItem .content {
    font-size: 15px;
    color: $mainTitleColor;
    max-width: 480px - 20px - 80px - 25px - 10px;
    margin-left: 8px;
  }
  .userMessage-wrapper-body .messageItem .timer {
    text-align: right;
    font-size: 13px;
    color: $subTitleColor;
    width: 80px;
  }
</style>
