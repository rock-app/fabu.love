<template>
  <el-row class="container">

    <el-col :span="24" class="topbar">
      <el-menu
        :collapse="isCollapsed"
        text-color="#fff">
        <el-menu-item index="2">
          <img class="menu-img" src="../assets/plane.png"/>
          <span slot="title">AppPublisher</span>
        </el-menu-item>
      </el-menu>

      <div class="topbar-content">
        <img class="menu-img" v-show="!isCollapsed" @click="changeCollapse" src="../assets/menu.png"/>
        <img class="menu-img" v-show="isCollapsed" @click="changeCollapse" src="../assets/menu2.png"/>
      </div>
    </el-col>


    <el-col :span="24" class="menu">
      <el-menu
        default-active="1"
        :collapse="isCollapsed"
        @select="handleSelect"
        text-color="#fff">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
            <el-menu-item index="1-3">选项3</el-menu-item>
            <el-menu-item index="1-4">选项1</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-setting"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
      </el-menu>

      <div class="content">
        <my-form></my-form>

        <my-table></my-table>
      </div>
    </el-col>
  </el-row>

</template>

<script type="text/ecmascript-6">
  import MyTable from './Table.vue'
  import MyForm from './Form.vue'

  export default {
    data() {
      return {
        isCollapsed: false
      }
    },
    methods: {
      changeCollapse() {
        this.isCollapsed = !this.isCollapsed
        console.log('change...')
        console.log(this.isCollapsed)
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath)
      }
    },
    components: {
      MyTable, MyForm
    }
  }
</script>

<style lang="scss">
  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  .menu {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: absolute;
    top: 70px;
    bottom: 0;
    overflow: hidden;
  }

  .el-menu {
    background-color: teal;
  }

  .el-submenu__title {
    padding-bottom: 0;
  }

  .el-menu-item-group__title {
    padding: 0;
  }

  .el-menu {
    flex-shrink: 0;
    width: 180px;
    border: 0;
  }

  .el-submenu .el-menu-item {
    min-width: 60px;
  }

  .el-menu--collapse {
    width: 60px;
  }

  .topbar {
    height: 70px;
    line-height: 70px;
    background: teal;
    display: flex;
    display: -webkit-flex;

    span {
      font-size: 20px;
      font-weight: bold;
    }

    .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
      background-color: teal;
    }

    .el-submenu .el-menu-item.is-active, .el-menu-item.is-active,
    .el-submenu .el-menu-item.is-active:hover, .el-menu-item.is-active:hover {
      background-color: teal;
      color: #fff;
    }

    .el-menu .el-menu-item, .el-submenu .el-submenu__title {
      height: 70px;
      line-height: 70px;
    }
  }

  .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
    background-color: #00bfff;
  }

  .el-submenu .el-menu-item.is-active, .el-menu-item.is-active,
  .el-submenu .el-menu-item.is-active:hover, .el-menu-item.is-active:hover {
    background-color: #00bfff;
    color: #fff;
  }

  //333744
  .el-menu .el-menu-item, .el-submenu .el-submenu__title {
    height: 60px;
    line-height: 60px;
  }

  .menu-toggle {
    background: #4A5064;
    text-align: center;
    color: white;
    height: 26px;
    line-height: 30px;
  }

  .menu-img {
    width: 20px;
    height: 20px;
  }

  .topbar-content {
    height: 100%;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    align-items: center;

    img {
      margin-left: 10px;
    }
  }

  .bg-deepBlue {
    background: deepskyblue;
  }

  .content {
    width: 100%;
    box-sizing: border-box;
    padding: 30px;
    overflow: scroll;
  }

</style>
