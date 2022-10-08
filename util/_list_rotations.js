import { rotationDb } from './_rotationDb'
import { replyFailed, replySuccess } from './util'

export async function listRotations(res) {
    try{
        let results = await rotationDb.getRotations()
    
        replySuccess(res, "OK!, these are the created rotations:"+JSON.stringify(results))
    } catch(err) {
        replyFailed(res, err)
    }    
}