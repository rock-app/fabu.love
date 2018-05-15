<template>
  <div class="teamMgr">
    <div style="width: 120px;height: 16px;background-color: #6477F2;position: absolute;top: 30px;right: 72px;border-radius: 10px;filter: blur(10px);z-index: -1"></div>
    <el-button class="uploadWrapper button-style-main" @click="createTeam">
      <img style="{width: 12; height: 12px;}" src="../../assets/ic_add@2x.png">
      <label> 新建团队</label>
    </el-button>
    <div class="teamMgr-header">
      <div>
        <div>
          <label>{{teamName}}</label>
          <img v-show="isOwner" class="teamMgr-edit" src="../../assets/ic_morecz.png" @click="showMenu" />
          <context-menu class="ctx-menu" ref="ctxMenu">
            <li class="ctx-item" @click="editAction">编辑团队名称</li>
            <li class="ctx-item menu-item" @click="dissolve">解散团队</li>
          </context-menu>
        </div>
        <div>
          <label class="teamMgr-teamId">ID: {{teamId}}</label>
        </div>
      </div>
      
    </div>
    <div class="teamMgr-collection">
      <div class="teamMgr-content">
        <div class="teamMgr-group-header">
          <img src="../../assets/ic_addmmb.png" @click="addClick" />
        </div>
        <item v-for="(member, index) in members" :key="index" :index="index" v-model="members[index]" @select="itemSelected" @roleUpdate="requestMembers"></item>
        <div class="teamMgr-group-footer">
          <div> 共 {{members.length}} 名成员</div>
        </div>
        <div class="teamMgr-group-bottom"></div>
      </div>
    </div>
    <el-dialog title="邀请成员" :visible.sync="isShowInvite" width="30%" center>
      <el-input placeholder="多个邮箱使用空格分开" :rows="10" type="textarea" v-model="invitedEmails">
      </el-input>
      <span slot="footer" class="dialog-footer">
              <el-button @click="isShowInvite=false">取 消</el-button>
              <el-button type="primary" @click="sendInvite">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="修改团队名称" :visible.sync="editing" width="30%" center>
      <el-input placeholder="请输入新的团队名称" type="text" v-focus="editing" :focus="editing" v-model="editName">
      </el-input>
      <span slot="footer" class="dialog-footer">
              <el-button @click="editing=false">取 消</el-button>
              <el-button type="primary" @click="modifyTeamName">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>{{message}}</span>
      <span slot="footer" v-if="isManager" class="dialog-footer">
          <el-button @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="deleteMember">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dissolveShow" width="30%">
      <span>确定要解散该团队吗？</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dissolveShow=false">取 消</el-button>
          <el-button type="primary" @click="dissolveTeam">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="创建团队" :visible.sync="createTeamVisible">
      <el-form :model="form">
        <el-form-item label="团队名称">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createTeamVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Item from './teamItem'
import * as TeamApi from '../../api/moudle/teamApi'
import * as UserApi from '../../api/moudle/userApi'
import * as useMgr from '../../mgr/userMgr'
import contextMenu from 'vue-context-menu'
export default {
  data() {
    return {
      teamName: '',
      teamId: '',
      editName: '',
      members: [],
      isShowInvite: false,
      dialogVisible: false,
      isManager: false,
      currentIndex: -1,
      message: '',
      invitedEmails: '',
      editing: false,
      isOwner: false,
      dissolveShow: false,
      createTeamVisible: false,
      form: {
        name: ''
      }
    }
  },
  mounted() {
    this.requestMembers()
    this.isOwner = useMgr.getUserTeam().role
    this.bus.$on('refreshList', () => {
      this.requestMembers()
    })
  },
  destroyed() {
    this.bus.$off('refreshList')
  },
  computed: {},
  methods: {
    sure() {
      this.createTeamVisible = false
      UserApi.createdTeam(this.form.name).then(resp => {
        this.$message({
          type: resp.success ? 'success' : 'error',
          message: resp.message
        })
        if (resp.success) {
          this.bus.$emit('createTeam')
        }
      })
    },
    createTeam() {
      this.createTeamVisible = true
    },
    showMenu() {
      this.$refs.ctxMenu.open()
    },
    editAction() {
      this.editing = !this.editing
      this.editName = this.teamName
      // if (!this.editing) {
      //   // 提交修改
      //   this.modifyTeamName()
      // }
    },
    dissolve() {
      this.dissolveShow = true
    },
    modifyTeamName() {
      let teamId = useMgr.getUserTeam()._id
      let name = this.editName
      TeamApi.updateTeamName(teamId, name).then(resp => {
        this.$message({
          type: resp.success ? 'success' : 'error',
          message: resp.message
        })
        if (resp.success) {
          let team = useMgr.getUserTeam()
          team.name = name
          this.teamName = name
          this.bus.$emit('teamNameUpdate', team)
        }
      })
      this.editing = false
    },
    dissolveTeam() {
      let teamId = useMgr.getUserTeam()._id
      TeamApi.dissolveTeam(teamId).then(resp => {
        this.$message({
          type: resp.success ? 'success' : 'error',
          message: resp.message
        })
        if (resp.success) {
          this.members = []
          this.teamName = ''
          let team = useMgr.getUserTeam()
          this.bus.$emit('dissolveTeam', team)
        }
      })
      this.dissolveShow = false
    },
    addClick() {
      this.isShowInvite = true
    },
    sendInvite() {
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
    itemSelected(index) {
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
    deleteMember() {
      this.dialogVisible = false
      if (this.currentIndex >= 0) {
        let teamId = useMgr.getUserTeam()._id
        let userId = this.members[this.currentIndex]._id
        TeamApi.deleteMembers(teamId, userId).then(resp => {
          this.$message({
            message: resp.message,
            type: resp.success ? 'success' : 'error'
          })
          if (resp.success) {
            this.requestMembers()
          }
        })
      }
    },
    stateUpdate() {
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
            this.message = isSelf
              ? '确定要离开该团队吗?'
              : '围观群众权限无法使用该功能，可联系项目创建者修改权限哦'
            this.isManager = isSelf
            break
        }
      }
    },
    request(emailList) {
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
    requestMembers() {
      let teamId = useMgr.getUserTeam()._id
      TeamApi.getTeamMembers(teamId).then(resp => {
        this.teamName = resp.data.name
        this.teamId = resp.data._id
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
    contextMenu
  },
  directives: {
    focus: {
      update(el, { value }) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  watch: {
    members() {
      let itemArr = this.members.filter(member => {
        return member._id === useMgr.getUserId()
      })
      if (itemArr && itemArr.length > 0) {
        this.isOwner = itemArr[0].role === 'owner'
      }
    },
    teamName() {
      this.editName = this.teamName
    }
  }
}
</script>

<style lang="scss">
@import '../../common/scss/base';
.teamMgr {
  margin-top: 24px;
  position: relative;
  user-select: text;
  .uploadWrapper {
    width: 144px;
    height: 48px;
    float: right;
    margin-right: 72px;
  }
  .uploadWrapper img {
    margin-right: 15px;
  }
  .uploadWrapper:hover {
    background-color: $mainColor;
    color: white;
  }
  .teamMgr-header {
    font-size: 24px;
    text-align: center;
    margin: 0px;
    height: 120px;
    // line-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-bottom: 1px solid #f4f7fd;
    padding-left: 216px;
    // background-color: #ff001f;
    .teamMgr-teamId {
      padding-top: 4px;
      font-size: 14px;
    }
    .teamMgr-edit {
      padding-left: 24px;
      padding-right: 24px;
      height: 18px;
      width: 4px;
      margin-top: -4px;
    }
    .ctx-menu {
      list-style: none;
      background-color: #fff;
      -webkit-background-clip: padding-box;
      background-clip: padding-box;
      border: 0 solid rgba(0, 0, 0, 0.15);
      border-radius: 0.25rem;
      -moz-box-shadow: 0 0 5px #d5dfed;
      -webkit-box-shadow: 0 0 5px #d5dfed;
      box-shadow: 0 0 5px #d5dfed;
      .ctx-menu-container {
        -moz-box-shadow: 0 5px 11px 0 #d5dfed, 0 4px 15px 0 #d5dfed;
        -webkit-box-shadow: 0 5px 11px 0 #d5dfed, 0 4px 15px 0 #d5dfed;
        box-shadow: 0 5px 11px 0 #d5dfed, 0 4px 15px 0 #d5dfed;
      }
    }
    .ctx-item {
      height: 44px;
      line-height: 44px;
    }
    .menu-item {
      color: #ff001f;
    }
  }

  .teamMgr-teamId {
    display: block;
    color: #aabad2;
  }

  .teamMgr-collection {
    margin: 0rem 2rem;
    // min-height: 300px;
    background-color: white;
    height: 100%;
    border-radius: 20px 20px 0px 0px;
  }
  .teamMgr-content {
    width: 66%;
    margin: auto;
    background-color: white;
    .teamMgr-group-header {
      height: 72px;
      line-height: 100px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-left: 24px;
      & > img {
        margin-top: -72px;
        margin-right: 24px;
        width: 48px;
        height: 48px;
        z-index: 400px;
        border-radius: 24px;
        box-shadow: 0px 2px 12px #cccccc;
      }
    }
    .teamMgr-group-footer {
      height: 72px;
      border-bottom: 1px dashed #d5dfed;
      text-align: center;
      display: flex;
      div {
        background-color: white;
        color: #d5dfed;
        padding-top: 62px;
        padding-left: 10px;
        padding-right: 10px;
        margin: auto;
        line-height: 20px;
      }
    }
    .teamMgr-group-bottom {
      height: 72px;
    }
  }
}
</style>
