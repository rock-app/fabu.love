


module.exports = class AppRouter {
  @request('get','/api/messages/{userId}')
  @summary("获取该用户未读消息列表")
  @query(
      {
      page:{type:'number',default:0,description:'分页页码(可选)'},
      size:{type:'number',default:10,description:'每页条数(可选)'}
  })
  @path({userId:{type:'string',description:'用户id,不传则获取该用户下的App'}})
  @tag
  static async getApps(ctx,next){
      var page = ctx.query.page || 0
      var size = ctx.query.size || 10
      var user = ctx.state.user.data;
      var { teamId } = ctx.validatedParams;        

      var result = await App.find(
              {'ownerId':teamId}
          ).limit(size).skip(page * size)
      ctx.body = responseWrapper(result)
  }
}