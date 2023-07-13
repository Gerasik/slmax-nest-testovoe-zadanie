import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

interface IUser {
  id: number
  username: string
  email: string
  password: string
  token: string
}
class Users {
  userList: IUser[]

  constructor() {
    this.userList = [
      {
        id: 1,
        username: "Gerasiks",
        email: "gerasik1992@gmail.com",
        password: "1asdasd",
        token: "asdasda",
      },
    ]
  }

  getUser(id: number) {
    return this.userList.find((item) => +id === item.id)
  }

  getUserByEmail(email: string) {
    return this.userList.find((item) => email === item.email)
  }

  addUser(user: Omit<IUser, "id">) {
    const nextId = this.userList[this.userList.length - 1].id + 1

    const newUser = { id: nextId + 1, ...user }

    this.userList.push(newUser)
    return newUser
  }

  updateUser(user: IUser) {
    const userId = this.userList.findIndex((i) => (i.id = user.id))

    this.userList[userId] = user
    return user
  }
}

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
