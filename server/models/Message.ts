import { model, Schema } from "mongoose"

const messageSchema = new Schema({
  text: String,
  createdAt: String,
  createdBy: String,
})

export default model("Message", messageSchema)
