import express = require("express");
const app = express()
import path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const port = process.env.API_PORT
import { createConnection } from 'typeorm'
import cors = require('cors')
import bodyParser = require('body-parser')
const router = express.Router()
import User from './entities/User'
import isAuthenticated from "./middleware/isAuthenticated";
import SessionController from "./controllers/SessionController";
import UserController from "./controllers/UserController";
import FileController from "./controllers/FileController";
import File from "./entities/File";
import isAuthorizedToDownloadFile from "./middleware/isAuthorizedToDownloadFile";
const fileUpload = require('express-fileupload')

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
      User, File
    ],
    logging: true,
  })

  router.put('/user', UserController.create)

  router.put('/session', SessionController.create)
  router.get('/session', isAuthenticated, SessionController.show)
  router.delete('/session', isAuthenticated, SessionController.destroy)

  router.get('/file', isAuthenticated, FileController.index)
  router.post('/file',isAuthenticated,fileUpload(),FileController.create)
  router.delete('/file/:uuid', isAuthenticated, FileController.destroy)
  router.get('/files/:uuid', isAuthorizedToDownloadFile, FileController.fetchFile)
  router.all('/files/*')
  router.use('/files', express.static(process.env.FILES as string))

  app.use('/api', router)
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/api`)
  })

}

main()