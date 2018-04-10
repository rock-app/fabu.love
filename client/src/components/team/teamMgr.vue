<template>
  <div class="teamMgr">
    <div class="teamMgr-header">
      <label v-show="!editing">{{teamName}}</label>
      <!-- <input v-show="editing" v-focus="editing" type="text" v-model="teamName"/> -->
      <img v-show="isOwner" class="teamMgr-edit" :src="picture" @click="editAction">
    </div>
    <div class="teamMgr-content">
      <div class="teamMgr-group-header">
        <div><label>团队人数 {{members.length}}</label><img src="../../assets/add_user.png" @click="addClick"/></div>
        <label>成员权限</label>
      </div>
      <item v-for="(member, index) in members" :key="index" :index="index" v-model="members[index]" @select="itemSelected"></item>
    </div>
   <!-- <invite-member v-show="isShowInvite" @invited="invited"></invite-member> -->
   <el-dialog title="邀请成员"
   :visible.sync="isShowInvite"
   width=50%
   center>
    <el-input placeholder="多个邮箱使用空格分开"
    :rows="10"
    type="textarea"
    v-model="invitedEmails">
    </el-input>
    <span slot="footer" class="dialog-footer">
          <el-button @click="isShowInvite=false">取 消</el-button>
          <el-button type="primary" @click="sendInvite">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog title="修改团队名称"
   :visible.sync="editing"
   width=50%
   center>
    <el-input placeholder="请输入新的团队名称"
    type="text"
    v-focus="editing"
    :focus="editing"
    v-model="teamName">
    </el-input>
    <span slot="footer" class="dialog-footer">
          <el-button @click="editing=false">取 消</el-button>
          <el-button type="primary" @click="modifyTeamName">确 定</el-button>
    </span>
  </el-dialog>
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
import * as TeamApi from '../../api/moudle/teamApi'
import * as useMgr from '../../mgr/userMgr'
import selectPicture from '../../assets/select.png'
import editPicture from '../../assets/edit.png'
export default {
  data() {
    return {
      teamName: '',
      members: [],
      isShowInvite: false,
      dialogVisible: false,
      isManager: false,
      currentIndex: -1,
      message: '',
      invitedEmails: '',
      editing: false,
      isOwner: false
    }
  },
  mounted () {
    this.requestMembers()
    this.isOwner = useMgr.getUserId() === useMgr.getUserTeam()._id
    this.bus.$on('refreshList', () => {
      this.isOwner = useMgr.getUserId() === useMgr.getUserTeam()._id
      this.requestMembers()
    })
  },
  destroyed() {
    this.bus.$off('refreshList')
  },
  computed: {
    picture () {
      return this.editing ? selectPicture : editPicture
    }
  },
  methods: {
    editAction () {
      this.editing = !this.editing
      if (!this.editing) {
        // 提交修改
        this.modifyTeamName()
      }
    },
    modifyTeamName () {
      let teamId = useMgr.getUserTeam()._id
      TeamApi.updateTeamName(teamId, this.teamName).then(resp => {
        this.$message({
          type: resp.success ? 'success' : 'error',
          message: resp.message
        })
      })
      this.editing = false
    },
    addClick () {
      this.isShowInvite = true
    },
    sendInvite () {
      this.isShowInvite = false
      let emailList = this.invitedEmails.split(' ')
      let validedEmailList = []
      for (var email of emailList) {
        if (this.valideEmail(email)) {
          var changedEmail = email.replace(/[\r\n]/g, '')
          validedEmailList.push(changedEmail)
        }
      }
      if (validedEmailList.length > 0) {
        this.request(validedEmailList)
      } else {
        this.$message.error('请输入正确的邮箱')
      }
      console.log(validedEmailList)
    },
    itemSelected (index) {
      this.currentIndex = index
      let cuurentId = useMgr.getUserId()
      let userId = this.members[this.currentIndex]._id
      let owner = this.members.filter(member => {
          return member._id === useMgr.getUserId()
        })[0].role
      if (cuurentId !== userId || owner !== 'owner') {
        this.stateUpdate()
        this.dialogVisible = true
      }
    },
    deleteMember () {
      this.dialogVisible = false
      if (this.currentIndex >= 0) {
        let teamId = useMgr.getUserTeam()._id
        let userId = this.members[this.currentIndex]._id
        TeamApi.deleteMembers(teamId, userId).then(resp => {
          this.$message({
            message: resp.message,
            type: 'success'
          })
          this.requestMembers()
        })
      }
    },
    stateUpdate () {
      if (this.currentIndex >= 0) {
        let owner = this.members.filter(member => {
          return member._id === useMgr.getUserId()
        })[0].role
        let name = this.members[this.currentIndex].username
        let isSelf = useMgr.getUserId() === this.members[this.currentIndex]._id
        switch (owner) {
          case 'owner':
            this.message = '确定要移除' + name + '吗?'
            this.isManager = true
            break
          case 'manager':
            this.message = '确定要移除' + name + '吗?'
            this.isManager = true
            break
          default:
            this.message = isSelf ? '确定要离开该团队吗?' : '围观群众权限无法使用该功能，可联系项目创建者修改权限哦'
            this.isManager = isSelf
            break
        }
      }
    },
    request (emailList) {
      let teamId = useMgr.getUserTeam()._id
      TeamApi.inviteMembers(teamId, emailList).then(resp => {
        if (resp.success) {
          this.$message({
            message: resp.message,
            type: 'success'
          })
          this.requestMembers()
        }
      })
    },
    requestMembers () {
      let teamId = useMgr.getUserTeam()._id
      TeamApi.getTeamMembers(teamId).then(resp => {
        this.teamName = resp.data.name
        this.members = resp.data.members
      })
    },
    valideEmail(email) {
      var re = /\S+@\S+\.\S+/
      return re.test(email)
    }
  },
  components: {
    Item,
    InviteMember
  },
  directives: {
    focus: {
      update (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
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
      .teamMgr-edit {
        width: 22px;
        height: 22px;
        margin-left: 10px;
      }
      input {
        background-color: inherit;
      }
    }
    .teamMgr-content {
      width: 66%;
      margin: auto;
      .teamMgr-group-header {
        height: 100px;
        line-height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 24px;
        & > div:first-child  {
          height: 22px;
          display: flex;
          align-items: center;
          img {
            width: 22px;
            height: 22px;
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
