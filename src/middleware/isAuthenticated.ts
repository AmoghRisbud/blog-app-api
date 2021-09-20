import User from './../entities/User'
import { getConnection } from 'typeorm'
require('dotenv').config()

const authenticateUser = async (token: any) => {

  try {
    const result = await getConnection()
      .createQueryBuilder()
      .select()
      .from(User, 'user')
      .where({ sessionToken: token, isActive: true })
      .execute()

    if (!result[0]) {
      return false
    }

    const userInfo = await getConnection()
      .createQueryBuilder()
      .select([
        'id',
      ])
      .from(User, 'user')
      .where({ id: result[0].id })
      .execute()


    return userInfo[0]
  } catch (err) {
    return false
  }
}

export default (req: any, res: any, next: any) => {
  const token = req.get('x-session-cookie')
  try {
    (async () => {
      const status = await authenticateUser(token)
      if (status) {
        // console.log(req.body);
        
        req.body.whoSentTheRequest = status
        next()

        
      } else {
        res.status(401).send('Unauthorized access.')
      }
    })()
  } catch (err) {
    res.status(401).send('')
  }
}

//req.body.whoSentTheRequest={}
//id