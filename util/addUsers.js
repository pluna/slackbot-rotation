import { rotationDb } from './_rotationDb'
import { replyFailed, replySuccess } from './util'

export async function addUsers(res, args) {    
    try{
        let index = args.findIndex((arg)=> arg==="to")
        console.log("to-index", index)
        if(index === undefined) {
            throw "Invalid number of arguments"
        }
        let key = args[index+1]
        console.log("key", key)
  
        let rotation = await rotationDb.getRotation(key)

        if(rotation===undefined) {
            console.log("is undefined")
            throw "Couldn't find rotation "+key
        }

        console.log("rotation", rotation)

        let users = rotation.users || new Array()
        let newUsers = args.slice(0,index)
        newUsers.forEach(element => {
            if(!users.includes(element))
                users.push(element)
        });

        rotation.users = users
        await rotationDb.updateRotation(rotation)
        
        replySuccess(res, "Ok! "+JSON.stringify(rotation.users, function replacer(key, value) { return value})+" are now the users in rotation "+key)
    } catch(err) {
        replyFailed(res, err)
    }    
}