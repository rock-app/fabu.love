import { User } from '../model/user'
import { resolve } from 'dns';
import compose from 'koa-compose'

export default class Varify {

    static async auth(key) {
        if (key) {
            var user = await User.findOne({ apiToken: key })
            if (!user) {
                throw new Error('api token is not exist')
            }
            return user
        } else {
            throw new Error('api token is not exist')
        }
    }

}