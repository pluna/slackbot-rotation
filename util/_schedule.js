import { replyFailed, replySuccess, getNextDayOfTheWeek, findNextUser } from './util'
import { slack } from '../util/_slack'
import { rotationDb } from './_rotationDb'
import { updateRotationOnSchedule } from './_update_on_schedule'

export async function schedule(res, args) {    
    try{
        let key = args[0]
        console.log("key", key)
    
        let rotation = await rotationDb.getRotation(key)

        if(rotation===undefined) {
            throw "Couldn't find rotation"
        }

        if(rotation.users === undefined || rotation.users.length==0)
            throw "Rotation needs at least one user to be scheduled"

        let is_fortnightly = args[2]=="other"
        let index = 2 + (is_fortnightly?1:0)
        let data = {
            is_forthnitely : is_fortnightly,
            day:args[index],
            hour:args[index+1]
        }

        rotation.schedule = data

        console.log("rotation", JSON.stringify(rotation))

        //Calculate next rotation
        var next = getNextDayOfTheWeek(data.day, data.hour, is_fortnightly)

        rotation.next = next.toISOString()
        rotation.active = true

        await rotationDb.updateRotation(rotation)

        await updateRotationOnSchedule(rotation)
        
        replySuccess(res, "OK! Rotation "+key+" will rotate on "+rotation.next)
    } catch(err) {
        replyFailed(res, err)
    }    
}

