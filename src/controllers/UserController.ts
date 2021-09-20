import {getConnection} from "typeorm";
import User from "../entities/User";
import * as argon2 from 'argon2'
import {v4 as uuid} from "uuid";

const UserController = {

  create: async (req: any, res: any) => {

    const hashedPassword = 
    await argon2.hash(req.body.password)
    const sessionToken = uuid()
    try{
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(
          { username: req.body.username, password: hashedPassword, sessionToken: sessionToken },
        )
        .returning('id')
        .execute();
      return res.status(200).send({data: {token: sessionToken}})
    } catch (err) {
      return res.status(400).send({data: null, errors: {username: "Username already taken. Please try with another username."}})
    }
  },

}

export default UserController