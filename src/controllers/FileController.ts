import { v4 as uuid } from 'uuid'
import {getConnection} from "typeorm";
import File from "../entities/File";

const generateUID = () => {
  const firstPart = (Math.random() * 46656) | 0;
  const secondPart = (Math.random() * 46656) | 0;
  const firstPartString = ("000" + firstPart.toString(36)).slice(-3);
  const secondPartString = ("000" + secondPart.toString(36)).slice(-3);
  return firstPartString + secondPartString;
}

const FileController = {

  index : async (req: any, res: any) => {
    const result = await getConnection()
      .createQueryBuilder()
      .select()
      .from(File, 'file')
      .where({userId: req.body.whoSentTheRequest.id})
      .execute()
    return res.status(200).send({ data: result })
  },

  create: async (req: any, res: any) => {

      if (!req.files) {
        return res.status(500).send({ msg: 'File to be uploaded not found.' })
      }

      const myFile = req.files.file

      if (myFile.size > 2048000) {
        return res
          .status(400)
          .send({ error: 'File too large. Please select file smaller than 2 MB' })
      }

      if (!/.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(myFile.name)) {
        return res
          .status(400)
          .send({ error: 'Supported formats are gif, jpeg, jpg and png' })
      }

      const fileUuid = uuid();

      myFile.name = myFile.name.replace(/(\.[\w\d_-]+)$/i, `-uuid-${fileUuid}$1`)

      //  mv() method places the file inside public directory

      myFile.mv(`${process.env.FILES}/${myFile.name}`, function (err: any) {
        if (err) {
          return res.status(500).send({ msg: 'Some error occurred' })
        }})

    const accessToken = generateUID();

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(File)
      .values({userId: req.body.whoSentTheRequest.id, filename: myFile.name, accesstoken: accessToken, uuid: fileUuid})
      .returning('id')
      .execute()

    if(!(result&&result.raw[0]&&result.raw[0].id)){
      return res.status(500).send({ msg: 'Some error occurred' })
    }

    return res.send({
      name: myFile.name,
      accessToken: accessToken,
      id: result.raw[0].id,
      uuid: fileUuid
    })
  },

  destroy: async (req: any, res: any) => {

    const fileOwner = await getConnection()
      .createQueryBuilder()
      .select()
      .from(File, 'file')
      .where({userId: req.body.whoSentTheRequest.id, uuid:req.params.uuid})
      .execute()

    if(!fileOwner||!fileOwner[0]){
      return res.status(400).send({ data: "You do not own any such file." })
    }

    await getConnection()
      .createQueryBuilder()
      .update(File)
      .delete()
      .where({uuid: req.params.uuid})
      .execute()

    return res.status(200).send({ data: true })

  },

  fetchFile: async (req: any, res: any) => {

    const filedetails = await getConnection()
      .createQueryBuilder()
      .select()
      .from(File, 'file')
      .where({uuid:req.params.uuid})
      .execute()

    return res.download(`${process.env.FILES}/${filedetails[0].filename}`, filedetails[0].filename.split("-uuid-")[0]);
  },

}

export default FileController