import {postHttp} from '../basehttp'

export function getTeamMembers(teamId, emails) {
  
}

export function inviteMembers(teamId, emails) {
  let param = {
    'emailList': emails,
    'role': 'guest'
  }
  let url = `api/team/${teamId}/invite`
  return postHttp(url, param)
}

export function deleteMembers() {

}