
import { slack } from './_slack'
import { rotationDb } from './_rotationDb'
import { replyFailed, replySuccess } from './util'

export async function createRotation(res, commandArray) {
    //validate command    
      if(commandArray.length !=1)
        throw "Invalid argument count"
      
      let name = commandArray[0]
      
      try {
        let model = {
            name:String(name),
            usergroupId: JSON.stringify(usergroup.usergroup),
        }

        await rotationDb.addRotation(model)
        
        console.log("slack time")        
        await slack.createUserGroup(name)
          
        replySuccess(res, `Successfully created usergroup ${name}`)
      } catch (err) {
          replyFailed(err, res)
      }
}