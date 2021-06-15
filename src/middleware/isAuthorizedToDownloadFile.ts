import {getConnection} from 'typeorm'
import File from "../entities/File";

require('dotenv').config()

const validateAccesstoken = async (uuid: string, accesstoken: string) => {
  try {
    const result = await getConnection()
      .createQueryBuilder()
      .select()
      .from(File, 'file')
      .where({accesstoken: accesstoken, uuid: uuid})
      .execute()
    return result[0];
  } catch (err) {
    return false
  }
}


export default (req: any, res: any, next: any) => {

  const uuid = req.params.uuid
  const accesstoken = req.query.accesstoken

  try {
    ;(async () => {
      const accesstokenValidation = await validateAccesstoken(uuid, accesstoken)

      if (accesstokenValidation) {
        next()
      } else {
        res.status(401).send({data:'Unauthorized access. The access token provided might be incorrect, or, the file may have been deleted by the user. Contact the file owner for more information.'})
      }
    })()
  } catch (err) {
    res.status(401).send('')
  }

}