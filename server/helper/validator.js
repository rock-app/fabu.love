const App = require('../model/app_model')
const Version = require('../model/version')
const Team = require('../model/team')


function isEmail(str){
    var re=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  if (re.test(str) != true) {
    return false;
  }else{
    return true;
  }
}



async function appAndUserInTeam(appId,teamId,userId) {
  var team = await Team.findOne({_id:teamId,members:{
      $elemMatch:{
           id:userId
      }
  },},"_id")
  var app = await App.find({_id:appId,ownerId:team._id})
  if (!app) {
      throw new Error("应用不存在或您不在该团队中")
  }else{
      return app
  }
}

// async function userInTeam(appId,teamId,userId) {
//   var team = await Team.findOne({_id:teamId,members:{
//       $elemMatch:{
//            _id:userId
//       }
//   },},"_id")
//   var app = await App.findOne({_id:id,ownerId:team._id})
//   if (!app) {
//       throw new Error("应用不存在或您不在该团队中")
//   }else{
//       return app
//   }
// }

async function userInTeamIsManager(userId,teamId) {
  var team = await Team.findOne({_id:teamId,members:{
    $elemMatch:{
         _id:userId,
         $or: [
            { role: 'owner' },
            { role: 'manager' }
        ]
    }
  },},"_id")
  return team
}

async function userInTeam(userId,teamId) {
  var team = await Team.findOne({_id:teamId,members:{
      $elemMatch:{
           _id:userId
      }
  },},"_id")
 
  return team
}


module.exports = { isEmail,userInTeamIsManager,userInTeam }