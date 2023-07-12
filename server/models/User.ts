// import { model, Schema } from "mongoose"

// const userSchema = new Schema({
//   username: { type: String, default: null },
//   email: { type: String, uniq: true },
//   password: { type: String },
//   token: { type: String },
// })

// export default model("User", userSchema)

import { MongoDataSource } from "apollo-datasource-mongodb"
import { ObjectId } from "mongodb"

interface UserDocument {
  _id: ObjectId
  username: string
  email: string
  password: string
  token: string
}

// This is optional
interface Context {
  loggedInUser: UserDocument
}
export default class Users extends MongoDataSource<UserDocument, Context> {
  getUser(userId: ObjectId) {
    return this.findOneById(userId)
  }
}
