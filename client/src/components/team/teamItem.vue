<template>
  <div class="teamItem ripple" @click="selected">
    <div>
      <div class="teamItem-circle" :class="color">{{lastName}}</div>
      <label class="teamItem-name">{{value.name}}</label>
    </div>
    <div>{{value.email}}</div>
    <div class="teamItem-owner">{{ownerString}}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    index: Number
  },
  data () {
    return {
      color: 'header-background-red'
    }
  },
  mounted () {
    let randomNumber = Math.floor(Math.random() * Math.floor(4))
    this.color = ['header-background-red', 'header-background-green', 
    'header-background-orange', 'header-background-purple'][randomNumber]
  },
  methods: {
    selected () {
      this.$emit('select', this.index)
    }
  },
  computed: {
    lastName () {
      let length = this.value.name.length
      return this.value.name.substring(length - 1)
    },
    ownerString () {
      switch (this.value.owner) {
        case 'creator':
          return '创建者'
        case 'manager':
          return '管理者'
        default:
          return '围观群众'
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../common/scss/base.scss';

  .teamItem {
    position: relative;
    height: 66px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(10, 10, 10, 0.1);
    .teamItem-circle {
      height: 44px;
      width: 44px;
      line-height: 44px;
      border-radius: 22px;
      display: inline-block;
      text-align: center;
      color: white;
      font-size: 20px;
      margin-left: 24px;
    }
    .teamItem-name {
        margin-left: 10px;
    }
    .teamItem-owner {
      margin-right: 24px;
    }
  }
  .teamItem:hover {
    background-color: #F4F7FD;
  }
  .ripple {
    position: relative;
    //隐藏溢出的径向渐变背景
    overflow: hidden;
  }

  .ripple:after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    //设置径向渐变
    background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform .3s, opacity .5s;
  }

  .ripple:active:after {
    transform: scale(0, 0);
    opacity: .3;
    //设置初始状态
    transition: 0s;
  }

  .header-background-red {
    background-color: rgb(226, 81, 65);
  }
  .header-background-green {
    background-color: rgb(103, 171, 91);
  }
  .header-background-orange {
    background-color: rgb(242,115, 56);
  }
  .header-background-purple {
    background-color: rgb(143, 56, 170);
  }
</style>

