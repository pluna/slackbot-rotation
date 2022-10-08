// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { tokenizeString } from "../../util/api"
import { createRotation} from "../../util/_create_rotation"
import { listRotations } from "../../util/_list_rotations"
import { schedule } from "../../util/_schedule"
import { addUsers } from "../../util/addUsers"

export default function handler(req, res) {
  const commandArray = tokenizeString(req.body.text)
  const action = commandArray[0]
  const args = commandArray.slice(1,commandArray.length)
  console.log("args", args)
  
  switch (action) {
    case 'create':
      createRotation(res, args)
      break
    case 'list':
      listRotations(res)
      break
    case 'add':
      addUsers(res, args)
      break
    case 'schedule':
      schedule(res,args)
      break
    default:
      res.send({
        response_type: 'ephemeral',
        text: 'Wrong usage of the command!',
      })
  }
  
  //res.status(200).json({ ok: true })
}
