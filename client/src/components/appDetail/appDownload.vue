<!--<template>-->
  <!--<div class="download-wrapper">-->
    <!--<div class="app-info">-->


    <!--</div>-->

  <!--</div>-->
<!--</template>-->

<!--<script type="text/ecmascript-6">-->
  <!--import * as AppResourceApi from '../../api/moudle/appResourceApi'-->
  <!--import {getUserTeam} from '../../mgr/userMgr'-->

  <!--export default {-->
    <!--props: {-->
      <!--appInfo: {-->
        <!--type: Object-->
      <!--}-->
    <!--},-->
    <!--data() {-->
      <!--return {-->
        <!--team: {}-->
      <!--}-->
    <!--},-->
    <!--created() {-->
      <!--this.team = getUserTeam()-->
    <!--},-->
    <!--methods: {-->
      <!--clickPreviewBtn() {-->
        <!--const {href} = this.$router.resolve({-->
          <!--name: 'AppPreView',-->
          <!--path: '/',-->
          <!--params: {'id': this.appInfo.shortUrl}-->
        <!--})-->
        <!--window.open(href, '_blank')-->
      <!--},-->
      <!--getIconUrl() {-->
        <!--return `${this.axios.defaults.baseURL}${this.appInfo.icon}`-->
      <!--},-->
      <!--getAppType() {-->
        <!--if (this.appInfo.appLevel === 'enterprise') {-->
          <!--return '企业版'-->
        <!--} else if (this.appInfo.appLevel === 'develop') {-->
          <!--return '内测版'-->
        <!--} else if (this.appInfo.appLevel === 'AppStore') {-->
          <!--return 'AppStore版'-->
        <!--} else {-->
          <!--return ''-->
        <!--}-->
      <!--},-->
      <!--referenceUpload() {-->

      <!--},-->
      <!--delectApp(item) {-->
        <!--this.$confirm('确认删除？')-->
          <!--.then(_ => {-->
            <!--AppResourceApi.delectApp(this.team._id, this.appInfo._id).then((res) => {-->
              <!--this.$message.success('删除成功')-->
              <!--this.$router.go(-1)-->
            <!--}, reject => {-->
              <!--this.$message.error(reject)-->
            <!--})-->
          <!--})-->
          <!--.catch(_ => {-->
          <!--})-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style lang="scss">-->
  <!--@import "../../common/scss/base";-->
  <!--.download-wrapper{-->
    <!--background-color: #FFA042;-->
  <!--}-->

<!--</style>-->
