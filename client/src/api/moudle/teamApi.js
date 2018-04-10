import {getHttp, deleteHttp, postHttp} from '../basehttp'

export function getTeamMembers(teamId, emails) {
  let url = `api/team/${teamId}/members`
  return getHttp(url)
}

export function inviteMembers(teamId, emails) {
  let param = {
    'emailList': emails,
    'role': 'guest'
  }
  let url = `api/team/${teamId}/invite`
  return postHttp(url, param)
}

export function deleteMembers(teamId, userId) {
  let url = `api/team/${teamId}/member/${userId}`
  return deleteHttp(url)
}

export function updateTeamName(teamId, name) {
  let url = `api/team/${teamId}/profile`
  let param = {
    'name': name
  }
  return postHttp(url, param)
}