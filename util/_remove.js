import { rotationDb } from './_rotationDb'
import { replyFailed, replySuccess } from './util'

export async function remove(res, args) {
    try{
        let asset = args[0]
        console.log('asset', asset)
        const subargs = args.slice(1,args.length)
        switch (asset) {
            case 'override':  //remove override <uid> from <name>
              await removeOverride(res, subargs)
              break
            default:
              res.send({
                response_type: 'ephemeral',
                text: 'Wrong usage of the command!',
              })
          }
    } catch(err) {
        replyFailed(res, err)
    }    
}

async function removeOverride(res, args){
    if(args.length != 3) throw "Invalide command. It should be remove override <uid> from <name>. uid can be * to remove all overrides"

    let oId = args[0]
    let name = args[2]
    let rotation = await rotationDb.getRotation(name)
    let overrides = rotation.overrides
    if(overrides===undefined) throw "Couldn't find the override: "+oId
    if(oId=="*"){
        overrides=new Array()
    }
    else{
        let index = overrides.findIndex( element => element.id==oId)
        if(index>=0){
            overrides.splice(index, 1)
        }
    }    
    rotation.overrides=overrides
    rotationDb.updateRotation(rotation)
    replySuccess(res, "OK!, I removed the override. These are the remaining overrides:"+JSON.stringify(overrides))
}