<template>
    <div class="qrcode-wrapper">
      <ul class="qrcode-wrapper-ul">
        <li v-for="(item, index) in downloadCodeImages" :key="index" class="itemWrapper">
          <img class="qrcode-icon" v-lazy="getIcon(item)" :onerror="defaultImg">
        </li>
      </ul>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      downloadCodeImages: {
        type: Array
      }
    },
    data() {
      return {
        defaultImg: 'this.src="' + require('../../assets/imgerror.png') + '"'
      }
    },
    created() {},
    methods: {
      getIcon(item) {
        console.log(`${this.axios.defaults.baseURL}${item.image}`)
        return `${this.axios.defaults.baseURL}${item.image}`
      }
    }
  }
</script>

<style lang="scss">
    @import "../../common/scss/base";

    .qrcode-wrapper {
      width: 100%;
    }
    .qrcode-wrapper-ul {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .qrcode-wrapper .itemWrapper {
      position: relative;
      padding-bottom: 24px;
      background-color: white;
      margin-top: 20px;
      width: 264px;
      height: 264px;
      text-align: center;
      border-radius: 4px ;
      transition: 0.5s;
      margin-right: 2.6%;
    }
    .qrcode-wrapper .itemWrapper:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 30px rgba(0,0,0,.1);
    }
    .qrcode-wrapper .itemWrapper:hover .appItem-info-namewrapper p {
      color: #000;
    }
    .qrcode-wrapper .itemWrapper .appItem-icon {
      width: 264px;
      height: 264px;
    }
</style>
