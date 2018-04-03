'use strict';

import {request, summary, tags, body,description,query} from '../swagger';
import {User, userSchema} from "../model/user";
import Team from "../model/team"
import Message from "../model/message"

import { responseWrapper } from "../helper/util";
import bcrypt from "bcrypt"
import Fawn from "fawn"

const tag = tags(['消息']);


module.exports = class MessageRouter {
  @request('get','/api/messages')
  @summary("获取该用户未读消息列表")
  @query(
      {
      page:{type:'number',default:0,description:'分页页码(可选)'},
      size:{type:'number',default:10,description:'每页条数(可选)'}
  })
  @tag
  static async getMessages(ctx,next){
      var page = ctx.query.page || 0
      var size = ctx.query.size || 10
      var user = ctx.state.user.data;
  

      var result = await Message.find(
              {'receiver':user._id}
          ).limit(size).skip(page * size)
      ctx.body = responseWrapper(result)
  }


  @request('delete','/api/messages')
  @summary("清空消息列表")
  @query(
      {
      page:{type:'number',default:0,description:'分页页码(可选)'},
      size:{type:'number',default:10,description:'每页条数(可选)'}
  })
  @tag
  static async clearMessages(ctx,next){
      var page = ctx.query.page || 0
      var size = ctx.query.size || 10
      var user = ctx.state.user.data;
      await Message.deleteMany({'receiver':user._id})
      ctx.body = responseWrapper(true,"消息已清空")
  }

}