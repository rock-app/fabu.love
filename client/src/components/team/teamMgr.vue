<template>
  <div class="teamMgr">
    <div class="teamMgr-header">{{teamName}}</div>
    <div class="teamMgr-content">
      <div class="teamMgr-group-header">
        <div><label>团队人数 {{memberCount}}</label><button @click="addMember">添加</button></div>
        <label>成员权限</label>
      </div>
      <item v-for="(member, index) in members" :key="index" :index="index" v-model="members[index]" @select="itemSelected"></item>
    </div>
   <invite-member v-show="isShowInvite" @invited="invited"></invite-member>
   <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%">
    <span>{{message}}</span>
    <span slot="footer" v-if="isManager" class="dialog-footer">
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="deleteMember">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import Item from './teamItem'
import InviteMember from '../appDetail/inviteMember'
export default {
  data() {
    return {
      teamName: '研发中心',
      memberCount: 10,
      members: [{name: '开发者', email: 'kaifazhe@qq.com', owner: 'creator'},
                {name: '设计师', email: 'shejishi@qq.com', owner: 'manager'},
                {name: '测试员', email: 'ceshiyuan@qq.com', owner: 'role'}],
      isShowInvite: false,
      dialogVisible: false,
      isManager: false,
      currentIndex: -1,
      message: ''
    }
  },
  computed: {
  },
  methods: {
    addMember () {
      this.isShowInvite = true
    },
    invited () {
      this.isShowInvite = false
    },
    itemSelected (index) {
      this.currentIndex = index
      this.stateUpdate()
      this.dialogVisible = true
    },
    deleteMember () {
      this.dialogVisible = false
      if (this.currentIndex >= 0) {

      }
    },
    stateUpdate () {
      if (this.currentIndex >= 0) {
        let owner = this.members[this.currentIndex].owner
        let name = this.members[this.currentIndex].name
        switch (owner) {
          case 'creator':
            this.message = '确定要移除' + name + '吗?'
            this.isManager = true
            break
          case 'manager':
            this.message = '确定要移除' + name + '吗?'
            this.isManager = true   
            break  
          default:
            this.message = '围观群众权限无法使用该功能，可联系项目创建者修改权限哦'
            this.isManager = false
            break
        }
      }
    },
    request () {
      
    }
  },
  components: {
    Item,
    InviteMember
  }
}
</script>

<style lang="scss">
  .teamMgr {
    margin-top: 24px;
    // background-color: white;
    height: 100%;
    .teamMgr-header {
      // background-color:#F4F7FD;
      font-size: 40px;
      text-align: center;
      margin: 0px;
      height: 120px;
      line-height: 120px;
      width: 100%;
      border-bottom: 1px solid #F4F7FD;
    }
    .teamMgr-content {
      width: 66%;
      margin: auto;
      .teamMgr-group-header {
        height: 100px;
        line-height: 100px;
        display: flex;
        justify-content: space-between;

        & > div:first-child  {
          margin-left: 24px;
          button {
            margin-left: 10px;
          }
        }
        & > label:last-child {
          margin-right: 24px;
        }
      }
    }
  }
</style>
