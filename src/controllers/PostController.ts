import { v4 as uuid } from 'uuid'
import { getConnection } from "typeorm";
import Post from "../entities/Post";

const generateUID = () => {
    const firstPart = (Math.random() * 46656) | 0;
    const secondPart = (Math.random() * 46656) | 0;
    const firstPartString = ("000" + firstPart.toString(36)).slice(-3);
    const secondPartString = ("000" + secondPart.toString(36)).slice(-3);
    return firstPartString + secondPartString;
}

const PostController = {

    
    
    mypost: async (req: any, res: any) => {
        const result = await getConnection()
            .createQueryBuilder()
            .select()
            .from(Post, 'post')
            .where({ userId: req.body.whoSentTheRequest.id })
            .execute()
        return res.status(200).send({ data: result })
    },
    index: async (_req: any, res: any) => {
        const result = await getConnection()
            .createQueryBuilder()
            .select()
            .from(Post, 'post')
           
            .execute()
        return res.status(200).send({ data: result })
    },

    create: async (req: any, res: any) => {

        console.log(req.body);
        

        const myPost = req.body

       

        const postUuid = uuid();

        // myPost.name = myPost.name.replace(/(\.[\w\d_-]+)$/i, `-uuid-${postUuid}$1`)
       
        const accessToken = generateUID();

        const result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Post)
            .values({ userId: req.body.whoSentTheRequest.id, title: myPost.title, summary:myPost.summary,post:myPost.post, accesstoken: accessToken, uuid: postUuid })
            .returning('id')
            .execute()

        if (!(result && result.raw[0] && result.raw[0].id)) {
            return res.status(500).send({ msg: 'Some error occurred' })
        }

        return res.send({
            name: myPost.name,
            accessToken: accessToken,
            id: result.raw[0].id,
            uuid: postUuid
        })
    },

    destroy: async (req: any, res: any) => {

        const postOwner = await getConnection()
            .createQueryBuilder()
            .select()
            .from(Post, 'post')
            .where({ createdby: req.body.whoSentTheRequest.id, uuid: req.params.uuid })
            .execute()

        if (!postOwner || !postOwner[0]) {
            return res.status(400).send({ data: "You do not own any such post." })
        }

        await getConnection()
            .createQueryBuilder()
            .update(Post)
            .delete()
            .where({ uuid: req.params.uuid })
            .execute()

        return res.status(200).send({ data: true })

    },

    fetchPost: async (req: any, res: any) => {

        const postdetails = await getConnection()
            .createQueryBuilder()
            .select()
            .from(Post, 'post')
            .where({ uuid: req.params.uuid })
            .execute()

        return res.status(200).send({ data: postdetails });
    },

}

export default PostController