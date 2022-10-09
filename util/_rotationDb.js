import { redis } from '../util/_constants'

// export const map = {}
// export const redis =  {
//     set: async function(key, value){
//         map[key]=value;
//         return value;
//     },
//     get: async function(key){
//         return map[key]
//     },
//     getAll: async function(){
//         return map;
//     },
// }

const ROTATION_KEY = "keys"

export const rotationDb = {
    getRotation: async function (rotationName){    
        const entries = await redis.smembers(ROTATION_KEY);
        console.log('entries', JSON.stringify(entries))
        if(entries.length == 0)
            return undefined
        const p = redis.pipeline();
        entries.forEach((id) => {
            if(id==rotationName) p.hgetall(id);
        });
        const results = await p.exec();
        if(results.length==0){
            return undefined
          }
        console.log("results", results)
        return results[0]
    },
    rotationExists: async function(name){
        const entries = await redis.smembers(ROTATION_KEY)
          console.log('data from fetch:', entries)          
          let rotations = entries.filter(rotationName => rotationName == name);

          if(rotations.length==0){
            return undefined
          }

          return rotations[0]
    },
    addRotation: async function(name, usergroup){
        let model = {
            name:String(name),
            usergroup: JSON.stringify(usergroup),
        }
        let rotationExists = await rotationDb.rotationExists(name)
        if(rotationExists!==undefined) {
            throw "Rotation already exists"
        }        
        const redisData = await redis.hset(name, model)
        await redis.sadd(ROTATION_KEY, name)
    },
    getAllRotations: async function(){
        const entries = await redis.smembers(ROTATION_KEY);

        const p = redis.pipeline();
        entries.forEach((id) => {
          p.hgetall(id);
        });
        return await p.exec();
    },
    updateRotation: async function(rotation) {
        if(rotation.name===undefined)
            throw "rotations must have a name"
        const redisData = await redis.hset(rotation.name, rotation)
    }
}