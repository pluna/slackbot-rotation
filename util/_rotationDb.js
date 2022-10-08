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
    getRotationsFromRedis: async function (redis, rotationName){    
        const entries = await redis.smembers(ROTATION_KEY);
        console.log('entries', JSON.stringify(entries))
        
        const p = redis.pipeline();
            entries.forEach((id) => {
              if(id==rotationName) p.hgetall(id);
            });
            const results = await p.exec();
            return results
    },
    rotationExists: async function(name){
        const entries = await redis.smembers(ROTATION_KEY)
          console.log('data from fetch:', entries)          
          let rotationName = entries.filter(rotationName => rotationName == name);
          return rotationName.length!=0
    },
    addRotation: async function(model){
        let rotationExists = await rotationDb.rotationExists(model.name)
        if(rotationExists) {
            throw "Rotation already exists"
        }        
        const redisData = await redis.hset(model.name, model)
        await redis.sadd(ROTATION_KEY, model.name)
    },
    getRotations: async function(){
        const entries = await redis.smembers(ROTATION_KEY);

        const p = redis.pipeline();
        entries.forEach((id) => {
          p.hgetall(id);
        });
        return await p.exec();
    }
}