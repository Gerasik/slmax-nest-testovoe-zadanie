interface IUser {
  id: number
  username: string
  email: string
  password: string
  token: string
}

export default class Users {
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
