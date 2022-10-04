// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { tokenizeString } from "../../util/api"
import { createRotation } from "../../util/_create_rotation"

export default function handler(req, res) {
  const commandArray = tokenizeString(req.body.text)
  const action = commandArray[0]
  console.log('request', action)
  
  switch (action) {
    case 'create':
      createRotation(res, commandArray)
      console.log("create")
      break
    default:
      res.send({
        response_type: 'ephemeral',
        text: 'Wrong usage of the command!',
      })
  }
  
  res.status(200).json({ ok: true })
}
