
import { slack } from './_slack'
import { rotationDb } from './_rotationDb'
import { replyFailed, replySuccess } from './util'

export async function createRotation(res, commandArray) {
    //validate command    
      if(commandArray.length !=1)
        throw "Invalid argument count"
      
      let name = commandArray[0]
      
      try {
        //Error if rotation already exists.
        let rotationExists = await rotationDb.getRotation(name)
        if(!rotationExists===undefined) {
            throw "Rotation already exists"
        }        

        console.log("create usergroup in slack")        
        let usergroup = await slack.createUserGroup(name)

        console.log("persist rotation")
        await rotationDb.addRotation(name, usergroup)
          
        replySuccess(res, `Great!, I created the rotation ${name}`)
      } catch (err) {
          replyFailed(res, err)
      }
}