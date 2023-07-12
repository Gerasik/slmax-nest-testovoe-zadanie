import User from "../../models/User"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

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
      const oldUser = await User.findOne({ email })

      if (oldUser) {
        throw new Error("A user is already registered with this email")
      }

      const encryptedPassword = await bcrypt.hash(password, 10)

      const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      })

      const token = jwt.sign({ user_id: newUser._id, email }, "UNSAFE_STRING", {
        expiresIn: "2h",
      })

      newUser.token = token

      const res = await newUser.save()

      return {
        id: res.id,
        ...res._doc,
      }
    },

    async loginUser(
      _: any,
      {
        loginInput: { email, password },
      }: { loginInput: { email: string; password: string } }
    ) {
      const user = await User.findOne({ email })

      if (user && (await bcrypt.compare(password, user.password))) {
        console.log(
          "🚀 ~ file: users.js:41 ~ loginUser ~ email, password :",
          email,
          password
        )

        const token = jwt.sign({ user_id: user._id, email }, "UNSAFE_STRING", {
          expiresIn: "2h",
        })

        user.token = token
        console.log("🚀 ~ file: users.js:55 ~ loginUser ~ user:", user)

        return {
          id: user.id,
          ...user._doc,
        }
      } else {
        throw new Error("Incorrect password")
      }
    },
  },
  Query: {
    user: async (_: any, { id }: { id: number }) => await User.findById(id),
  },
}
