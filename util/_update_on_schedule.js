import { rotationDb } from './_rotationDb'
import { getNextDayOfTheWeek, replyFailed, replySuccess } from './util'
import { slack } from './_slack'

export async function updateRotationsOnSchedule(res, args) {
    if(args.length!=1) throw "The name of the rotation is needed"
    let rotation = await rotationDb.getRotation(args[0])
    if(rotation===undefined) throw "couldn't find rotation"
    try{
        console.log('rotation',JSON.stringify(rotation))
        updateRotationOnSchedule(rotation)
    }catch(err){
        replyFailed(res, err)
    }
}

export async function updateRotationOnSchedule(rotation) {
    console.log("checking rotation", rotation.active)
    if(!(rotation.active === undefined)){
        console.log("rotation is active")
        //rotation is active, so update if needed
        let now = new Date()        
        let override = findActiveOverride(rotation, now)
        if(!(override===undefined)){
            console.log('active override', JSON.stringify(override))
            console.log('usergroup', JSON.stringify(rotation.usergroup))
            //there's an active override, so use it
            let usergroup = await slack.setUsersInUserGroup(rotation.usergroup.id,[override.user])
            rotation.usergroup = usergroup
            rotationDb.updateRotation(rotation)
        } else {
            if(now>=rotation.next){
                let nextUserIndex = findNextUserIndex(rotation.users, rotation._nextUserIndex)
                let next = getNextDayOfTheWeek(rotation.schedule.day, rotation.schedule.hour, rotation.schedule.is_forthnitely)
                let usergroup = await slack.setUsersInUserGroup(rotation.name,rotation.users[nextUserIndex])
                rotation._nextUserindex = nextUserIndex
                rotation.next = next
                rotation.usergroup = usergroup
                rotationDb.updateRotation(rotation)
            }
        }
    }
}

function findActiveOverride(rotation, now){    
    let overrides = rotation.overrides
    console.log('overrides', overrides)
    let override = undefined
    if(!(overrides === undefined)) {    
        overrides.forEach(element => {            
            let fromdate = new Date(element.fromdate)
            let todate = new Date(element.todate)
            console.log(now.toISOString() +"\n"+fromdate.toISOString()+"\n"+todate.toISOString())
            console.log('compare', now.getTime()>fromdate.getTime() && now.getTime()<todate.getTime())
            if(now.getTime()>fromdate.getTime() && now.getTime()<todate.getTime()) {
                override=element
                console.log('updating', override)
            }                
        });
    }
    return override
}

function findNextUserIndex(users, currentIndex){
    let nextIndex = -1
    if(currentIndex === undefined) {
        nextIndex=-1
    }  
    else if(currentIndex == users.length-1)
        nextIndex=-1
    return nextIndex+1
}