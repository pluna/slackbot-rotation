import { replyWithError } from '../util/api'
export async function createRotation(res, commandArray) {
    console.log("made it")
    return "hola";
}

/*
export async function createRotation(res, commandArray) {
    //validate command
      if(commandArray.length !=1)
          return replyWithError(res, "Invalid argument count")
  
      let name = commandArray[1]
  
      try {
          //validate rotation
          const data = await redis.get(name)
          console.log('data from fetch:', data)
          
          if(!(data === undefined) && data != "") {
              return replyWithError(res, "Rotation already exists")
          }        
  
          //create usergroup in slack
          let usergroupId = await createUserGroup(name)
          if(!(usergroupId === undefined)) {
              return replyWithError(res, "couldn't create the usergroup")
          }
          
          //persist in redis
          let model = {
              name:name,
              usergroupId: usergroupId,
          }
          const redisData = await redis.set(name, JSON.stringify(model))
  
          console.log('data from fetch:', data)    
          
          res.send({
              response_type: 'in_channel',
              text: `Successfully created usergroup ${name}`,
          })
      } catch (err) {
          console.log('fetch Error:', err)
          res.send({
              response_type: 'ephemeral',
              text: `${err}`,
          })
      }
  }

  */
  