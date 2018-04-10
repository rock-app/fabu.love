<template>
  <div>
    <!--头部-->
    <appDetailHeader
      :appInfo="this.appInfo"
      v-show="this.appInfo._id"
    >
    </appDetailHeader>

    <appVersions
      v-show="!showAppSetting"
      v-if="appInfo._id"
      :appInfo="appInfo"
      :subTitleArr="subTitleArr"
      @updateAppInfoSuccess="updateAppInfoSuccess"
    >
    </appVersions>

    <appSetting
      v-if="showAppSetting"
      :appInfo="appInfo">
    </appSetting>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import { getUserTeam } from '../../mgr/userMgr'
  import AppDetailHeader from './appDetailHeader.vue'
  import AppVersions from './appVersions.vue'
  import AppSetting from './appSetting.vue'

  export default {
    data() {
      return {
        subTitleArr: ['', '', ''],
        userteam: {},
        appInfo: {},
        showAppSetting: false
      }
    },
    components: {
      AppDetailHeader, AppVersions, AppSetting
    },
    computed: {},
    destroyed() {
      this.bus.$off('appSummary')
      this.bus.$off('appSetting')
    },
    created() {
      this.$nextTick(() => {
        this.userteam = getUserTeam()
        this.getAppDetailData()
      })
      this.bus.$on('appSummary', () => {
        this.showAppSetting = false
      })
      this.bus.$on('appSetting', () => {
        this.showAppSetting = true
      })
    },
    methods: {
      getAppDetailData() {
        AppResourceApi.getAppDetail(this.userteam._id, this.$route.params.appId).then((res) => {
          console.log(res)
          this.appInfo = res.data
          this.subTitleArr = []
          this.subTitleArr.push(this.appInfo.bundleId)
          this.subTitleArr.push(this.axios.defaults.baseURL + this.appInfo.shortUrl)
          this.subTitleArr.push(this.appInfo._id)
          this.bus.$emit('appdetail', res.data.appName)
        }, reject => {
          this.$message.error(reject)
        })
      },
      updateAppInfoSuccess() {
        this.getAppDetailData()
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";


</style>
