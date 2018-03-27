<template>
  <div>
    <!--头部-->
    <appDetailHeader
      :appInfo="this.appInfo"
      :subTitleArr="this.subTitleArr"
    >
    </appDetailHeader>

    <appVersions v-if="appInfo._id" :appId="appInfo._id" :shortUrl="this.appInfo.shortUrl"></appVersions>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as AppResourceApi from '../../api/moudle/appResourceApi'
  import {getUserTeam} from '../../mgr/userMgr'
  import AppDetailHeader from './appDetailHeader.vue'
  import AppVersions from './appVersions.vue'

  export default {
    data() {
      return {
        subTitleArr: ['', '', ''],
        userteam: {},
        appInfo: {}
      }
    },
    components: {
      AppDetailHeader, AppVersions
    },
    computed: {
    },
    created() {
      this.$nextTick(() => {
        this.userteam = getUserTeam()
        this.getAppDetailData()
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
        }, reject => {
          this.$message.error(reject)
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/base";


</style>
