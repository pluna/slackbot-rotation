import { getRotationsFromRedis, redis} from '../util/_constants'
import { replyFailed, replySuccess, getNextDayOfTheWeek } from './util'
import { slack } from '../util/_slack'

export async function schedule(res, args) {    
    try{
        let key = args[0]
        console.log("key", key)
    
        //To run multiple queries at once, Upstash supports the use of the pipeline command. This way we can run multiple queries at once and get the results in a single call.
        let results = await getRotationsFromRedis(redis, key)

        if(results.length == 0) {
            throw "Couldn't find rotation"
        }
        console.log("results", results)

        let rotation = results[0]

        let is_fortnightly = args[2]=="other"
        let index = 2 + (is_fortnightly?1:0)
        let data = {
            is_forthnitely : is_fortnightly,
            day:args[index],
            hour:args[index+1]
        }

        rotation.schedule = data

        //Calculate next rotation
        var next = getNextDayOfTheWeek(data.day, data.hour, is_fortnightly);

        console.log('next', next)
        rotation.next = next.toISOString()

        const redisData = await redis.hset(key, rotation)

        await slack.updateUserGroup(key, rotation.users)
        
        replySuccess(res, "Scheduled "+JSON.stringify(data, function replacer(key, value) { return value})+" to rotation "+key)
    } catch(err) {
        replyFailed(res, err)
    }    
}