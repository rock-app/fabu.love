/**
 * Created by darren on 2018/3/15.
 */
import {postHttp} from '../basehttp'

// 注册
export function getAppList() {
  let url = 'api/apps'
  return postHttp(url)
}
