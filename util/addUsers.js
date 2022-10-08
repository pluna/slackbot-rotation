import { getRotationsFromRedis, redis} from '../util/_constants'
import { replyFailed, replySuccess } from './util'

export async function addUsers(res, args) {    
    try{
        let index = args.findIndex((arg)=> arg==="to")
        console.log("to-index", index)
        if(index<0) {
            throw "Invalid number of arguments"
        }
        let key = args[index+1]
        console.log("key", key)

        //Get all survey entries by id/key
    
        //To run multiple queries at once, Upstash supports the use of the pipeline command. This way we can run multiple queries at once and get the results in a single call.
        let results = getRotationsFromRedis(redis, key)

        if(results.length == 0) {
            throw "Couldn't find rotation"
        }
        
        console.log('engs', 'engs')

        let rotation = results[0]

        let users = rotation.users || new Array()
        console.log('users', users)

        let newUsers = args.slice(0,index)                      
        
        newUsers = newUsers.concat(users)
        console.log('new user', newUsers)

        console.log('rotation', JSON.stringify(rotation))

        rotation.users = newUsers

        const redisData = await redis.
          hset(key, rotation)
        
        replySuccess(res, "Added "+JSON.stringify(rotation, function replacer(key, value) { return value})+" to rotation "+key)
    } catch(err) {
        replyFailed(res, err)
    }    
}