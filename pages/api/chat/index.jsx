import dbConnect from "../../../util/mongo";
import Chat from "../../../models/Chat";

export default async function handler (req, res){
  const {
    method
  } = req;

  await dbConnect();

  if (method === "GET") {
    try {
        const chat = await Chat.find()
        .populate('userID')
        .exec()
        .then(docs=>{
            res.status(200).json(docs);
        });
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json(err);
    }
  }
  if (method === "PUT") {
    res.status(200).json("waiting");
  }
  if (method === "DELETE") {
    res.status(200).json("waiting");
  }
};
