<template>
  <div class="teamItem ripple">
    <div>
      <div class="teamItem-circle" :class="color">{{lastName}}</div>
      <label class="teamItem-name">{{value.username}}</label>
      <div class="teamItem-email">| {{value.email}}</div>
    </div>
    <div class="teamItem-owner" @click.stop="roleAction">
      <label>{{ownerString}}</label>
      <img v-show="isRole" :class="[rotate ? 'fa fa-arrow-down position-origin' : 'fa fa-arrow-down position-rotate']" src="../../assets/ic_moreqx.png"/>
    </div>
    <context-menu class="ctx-menu" ref="ctxMenu">
        <li class="ctx-item" @click="setRoleToManager">管理员</li>
        <li class="ctx-item" @click="setRoleToGuest">队员</li>
        <li class="ctx-item menu-item" @click="selected">移除该队员</li>
    </context-menu>
  </div>
</template>

<script>
import * as useMgr from '../../mgr/userMgr'
import contextMenu from 'vue-context-menu'

export default {
  props: {
    value: Object,
    index: Number
  },
  data () {
    return {
      color: 'header-background-red',
      isRole: false,
      rotate: false
    }
  },
  created () {
    let randomNumber = Math.floor(Math.random() * Math.floor(4))
    this.isRole = (useMgr.getUserId() === useMgr.getUserTeam()._id) && this.value.role !== 'owner'
    this.color = ['header-background-red', 'header-background-green', 
    'header-background-orange', 'header-background-purple'][randomNumber]
  },
  methods: {
    selected () {
      this.$emit('select', this.index)
    },
    roleAction () {
      this.rotate = !this.rotate
      this.$refs.ctxMenu.open()
      alert(this.rotate)
    },
    setRoleToManager () {

    },
    setRoleToGuest () {

    },
    roleModify () {

    },
    close() {
      this.rotate = !this.rotate
    }
  },
  computed: {
    lastName () {
      let length = this.value.username.length
      return this.value.username.substring(length - 1)
    },
    ownerString () {
      switch (this.value.role) {
        case 'owner':
          return '创建者'
        case 'manager':
          return '管理者'
        default:
          return '围观群众'
      }
    }
  },
  components: {
    contextMenu
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
      margin-left: 1rem;
      color: #354052;
      font-size: 1rem;
    }
    .teamItem-owner {
      margin-right: 24px;
    }
    .teamItem-email {
      display: inline-block;
      margin-left: 1rem;
      color: #AABAD2;
      font-size: 1rem;
    }
  }

  .ctx-menu {
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 0px solid rgba(0, 0, 0, .15);
    border-radius: .25rem;
    -moz-box-shadow:0 0 5px #D5DFED; 
    -webkit-box-shadow:0 0 5px #D5DFED; box-shadow:0 0 5px #D5DFED;
    .ctx-menu-container {
      box-shadow: 0 5px 11px 0 #D5DFED, 0 4px 15px 0 #D5DFED;
    }
  }
  .ctx-item {
    height: 44px;
    line-height: 44px;
  }
  .menu-item {
    color: #FF001F;
  }
      
  .postion-origin {
    transition: all 1s;
  }

  .postion-rotate {
    transform: rotate(-180deg);
    transition: all 1s;
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

