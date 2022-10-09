import { rotationDb } from './_rotationDb'
import { findNextUser, replyFailed, replySuccess } from './util'
import { slack } from './_slack';
import { updateRotationOnSchedule } from './_update_on_schedule';

export async function override(res, args) {
    try{

        //check command is correct
        if(args.length != 9) {
            throw "Incorrect command. It should have the form override <name> with <mention> from 2022/12/24 23:00 to 2022/01/15 14:00 ";
        }
        let name = args[0];
        let rotation = await rotationDb.getRotation(name)

        if(rotation===undefined)
            throw "couldn't find rotation "+name

        let fromDate = new Date(args[4] + " "+args[5]);
        let toDate = new Date(args[7] + " "+args[8]);

        const id =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        let override = {id:id, fromdate:fromDate.toISOString(), todate:toDate.toISOString(), user:args[2]};
        
        console.log('rotation',rotation)
        let overrides = rotation.overrides || new Array()
        let exists = false
        overrides.forEach(element => {
            exists = exists || (element.fromdate == override.fromdate && element.todate == override.todate && element.user == override.user)
        });
        if(exists)
            throw "override already exists"
        overrides.push(override)
        rotation.overrides = overrides
        
        await rotationDb.updateRotation(rotation)

        //If rotation is live update if needed
        if(rotation.active !== undefined) {
            await updateRotationOnSchedule(rotation)
        }
            

        replySuccess(res, "Okay, I added the override " + JSON.stringify(override)+" with id "+id+" to rotation "+name)
    } catch(err) {
        replyFailed(res, err)
    }    
}