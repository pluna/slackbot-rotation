
import { slack } from './_slack'
import { rotationDb } from './_rotationDb'
import { replyFailed, replySuccess } from './util'

export async function createRotation(res, commandArray) {
    //validate command
    let createUsergroup = true
    if(commandArray.length==4) {
        //command: create <name> with usergroup <ugroup>
        if(commandArray[1]=="with" && commandArray[2]=="usergroup")
            createUsergroup = false
        else
            throw "Invalid argument count"
    }
    else if(commandArray.length !=1) throw "Invalid argument count"  //command: create <name>
    
    let name = commandArray[0]
    
    try {
        //Error if rotation already exists.
        let rotationExists = await rotationDb.rotationExists(name)
        if(!rotationExists===undefined) {
            throw "Rotation already exists"
        }        

        let usergroup = undefined
        if(createUsergroup){
            console.log("create usergroup in slack")        
            usergroup = await slack.createUserGroup(name)
        } else {
            let ugroup = commandArray[3]
            console.log("find usergroup"+ugroup+" in slack")
            usergroup = await slack.getUserGroup(ugroup)
            if(usergroup===undefined)
                throw "Couldn't find the usergroup "+ugroup
        }

        console.log("persist rotation")
        await rotationDb.addRotation(name, usergroup)
            
        replySuccess(res, `Great!, I created the rotation ${name}`)
    } catch (err) {
        replyFailed(res, err)
    }
}