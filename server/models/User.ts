import { model, Schema } from "mongoose"

const userSchema = new Schema({
  username: { type: String, default: null },
  email: { type: String, uniq: true },
  password: { type: String },
  token: { type: String },
})

export default model("User", userSchema)
