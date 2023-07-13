interface IMessage {
  id: number
  room: number
  text: string
  createdAt: string
  createdBy: string
}

export default class Messages {
  messageList: IMessage[]

  constructor() {
    this.messageList = []
  }

  createMessage(message: Omit<IMessage, "id">) {
    const nextId = this.messageList.length
      ? this.messageList[this.messageList.length - 1].id + 1
      : 0
    const newMessage = { id: nextId, ...message }
    this.messageList.push(newMessage)

    return message
  }

  getAll() {
    return this.messageList
  }
}
