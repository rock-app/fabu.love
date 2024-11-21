<template>
  <div class="teamItem">
    <div>
      <div class="teamItem-circle" :class="color">{{ lastName }}</div>
      <label class="teamItem-name">{{ user.username }}</label>
      <div class="teamItem-email">| {{ user.email }}</div>
    </div>
    <div class="teamItem-owner" @click.stop="roleAction">
      <label>{{ ownerString }}</label>
      <img v-show="isRole" class="teamItem-owner-img" :style="iconStyle" src="../../common/assets/ic_moreqx.png"/>
    </div>
  </div>
</template>


<script setup>
import ContextMenu from "@imengyu/vue3-context-menu";
import { ref, computed, watch } from 'vue';
import * as useMgr from '../../mgr/userMgr';
import * as TeamApi from '../../api/moudle/teamApi';

const props = defineProps({
  value: Object,
  index: Number
});
const emit = defineEmits([ 'select', 'roleUpdate' ]);

const color = ref('header-background-red');
const isRole = ref(false);
const rotate = ref(false);
const isSelf = ref(false);
const isManager = ref(false);
const showMenu = ref(false);

const user = defineModel()

const valueChanged = () => {
  let randomNumber = Math.floor(Math.random() * 4);
  isSelf.value = useMgr.getUserId() === user.value._id;
  isManager.value = useMgr.getUserTeam().role !== 'guest';
  isRole.value = ( isManager.value || isSelf.value ) && user.value.role !== 'owner';
  color.value = [ 'header-background-red', 'header-background-green', 'header-background-orange', 'header-background-purple' ][randomNumber];
};

const selected = () => {
  emit('select', props.index);
  showMenu.value = false;
};

const roleAction = (e) => {
  if ( isRole.value ) {
    rotate.value = !rotate.value;
    showMenu.value = true;

    const items = []
    if ( isManager.value || !isSelf.value ) {
      items.push({
        label: "管理员",
        customClass: 'ctx-item',
        onClick: () => {
          setRoleToManager();
        }
      });
    }
    if ( isManager.value || !isSelf.value ) {
      items.push({
        label: "围观群众",
        customClass: 'ctx-item',
        onClick: () => {
          setRoleToGuest();
        }
      });
    }
    if ( isManager.value || !isSelf.value ) {
      items.push({
        label: isSelf.value ? '离开该团队' : '移除该队员',
        customClass: 'ctx-item menu-item',
        onClick: () => {
          selected();
        }
      });
    }
    ContextMenu.showContextMenu({
      x: e.x,
      y: e.y,
      items: items,
      onClose: onCtxClose
    });
  }
};

const setRoleToManager = () => {
  roleModify('manager');
  showMenu.value = false;
};

const setRoleToGuest = () => {
  roleModify('guest');
  showMenu.value = false;
};

const roleModify = (role) => {
  let teamId = useMgr.getUserTeam()._id;
  let memberId = user.value._id;
  TeamApi.modifyRole(teamId, memberId, role).then(resp => {
    emit('roleUpdate');
  });
};

const onCtxClose = () => {
  showMenu.value = false;
};

const lastName = computed(() => {
  let length = user.value.username.length;
  return user.value.username.substring(length - 1);
});

const ownerString = computed(() => {
  switch (user.value.role) {
    case 'owner':
      return '创建者';
    case 'manager':
      return '管理员';
    default:
      return '围观群众';
  }
});

const lastItem = computed(() => {
  return isSelf.value ? '离开该团队' : '移除该队员';
});

const iconStyle = computed(() => {
  return showMenu.value ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' };
});

watch(() => user.value, valueChanged);

valueChanged();
</script>

<style lang="scss">
@use '../../common/scss/base.scss' as *;

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

    & > img {
      display: inline-block;
    }
  }

  .teamItem-email {
    display: inline-block;
    margin-left: 1rem;
    color: #aabad2;
    font-size: 1rem;
  }
}

.ctx-item {
  height: 40px;
}

.menu-item {
  color: #ff001f;
}

.teamItem-owner-img {
  transition: all 300ms ease-out;
}

.header-background-red {
  background-color: rgb(226, 81, 65);
}

.header-background-green {
  background-color: rgb(103, 171, 91);
}

.header-background-orange {
  background-color: rgb(242, 115, 56);
}

.header-background-purple {
  background-color: rgb(143, 56, 170);
}
</style>

