import express = require("express");
const app = express()
import path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const port = process.env.API_PORT
import { createConnection } from 'typeorm'
import cors = require('cors')
import bodyParser = require('body-parser')
const router = express.Router()
import User from './entities/User';
import Post from './entities/Post';
import isAuthenticated from "./middleware/isAuthenticated";

import SessionController from "./controllers/SessionController";
import UserController from "./controllers/UserController";
import PostController from "./controllers/PostController";

const main = async () => { 

  app.use(bodyParser.json())
  app.use(cors({ origin: process.env.FRONTEND_SERVER, credentials: true }))

  //Creating database connection
  await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST as string,
    port: process.env.DB_PORT as any,
    username: process.env.DB_USER as string,
    password: process.env.DB_PWD as string,
    database: process.env.DB_NAME as string,
    synchronize: true,
    entities: [
      User, Post
    ],
    logging: true,
  })

  router.put('/user', UserController.create)

  router.put('/session', SessionController.create)
  router.get('/session', isAuthenticated, SessionController.show)
  router.delete('/session', isAuthenticated, SessionController.destroy)

  router.get('/post', isAuthenticated, PostController.index)
  router.get('/mypost', isAuthenticated, PostController.mypost)
  router.post('/post',isAuthenticated, PostController.create)
  router.delete('/post/:uuid', isAuthenticated, PostController.destroy)
  router.get('/post/:uuid', isAuthenticated, PostController.fetchPost)
  router.all('/posts/*')
  // router.use('/posts', express.static(process.env.FILES as string))

  app.use('/api', router)
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/api`)
  })
}

main()