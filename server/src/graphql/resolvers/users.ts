import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import Users from "../../models/User"

const users = new Users()

export default {
  Mutation: {
    async registerUser(
      _: any,
      {
        registerInput: { username, email, password },
      }: {
        registerInput: { username: string; email: string; password: string }
      }
    ) {
      const oldUser = users.getUserByEmail(email)
      if (oldUser) {
        throw new Error("A user is already registered with this email")
      }
      const encryptedPassword = await bcrypt.hash(password, 10)
      const newUser = users.addUser({
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
        token: "",
      })
      const token = jwt.sign({ user_id: newUser.id, email }, "UNSAFE_STRING", {
        expiresIn: "2h",
      })

      newUser.token = token

      const res = users.updateUser(newUser)

      return res
    },
    async loginUser(
      _: any,
      {
        loginInput: { email, password },
      }: { loginInput: { email: string; password: string } }
    ) {
      const user = users.getUserByEmail(email)
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ user_id: user.id, email }, "UNSAFE_STRING", {
          expiresIn: "2h",
        })
        user.token = token
        console.log("🚀 ~ file: users.js:55 ~ loginUser ~ user:", user)
        return user
      } else {
        throw new Error("Incorrect password")
      }
    },
  },
  Query: {
    user: async (_: any, { id }: { id: number }) => {
      console.log("🚀 ~ file: users.ts:81 ~ user: ~ id:", id)
      return users.getUser(id)
    },
  },
}
