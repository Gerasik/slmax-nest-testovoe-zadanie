const User = require("../../models/User")
const { ApolloError } = require("apollo-server-errors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

module.exports = {
  Mutation: {
    async registerUser(_, { registerInput: { username, email, password } }) {
      const oldUser = await User.findOne({ email })

      if (oldUser) {
        throw new ApolloError(
          "A user is already registered with this email",
          "USER_ALREADY_CREATED"
        )
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

    async loginUser(_, { loginInput: { email, password } }) {
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
        throw new ApolloError("Incorrect password", "INCORRECT_PASSWORD")
      }
    },
  },
  Query: {
    user: async (_, { id }) => await User.findById(id),
  },
}
