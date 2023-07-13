// import Message from "../../models/Message"

import { PubSub } from "graphql-subscriptions"

interface IMessage {
  id: number
  room: number
  text: string
  createdAt: string
  createdBy: string
}

class Messages {
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

const messages = new Messages()

const pubsub = new PubSub()

const MESSAGE_CREATED = "MESSAGE_CREATED"

export default {
  Query: {
    messages() {
      return messages.getAll()
    },
  },
  Mutation: {
    async createMessage(
      _: any,
      {
        messageInput: { text, username, room },
      }: { messageInput: { text: string; username: string; room: string } }
    ) {
      const res = messages.createMessage({
        text: text,
        room: +room,
        createdBy: username,
        createdAt: new Date().toISOString(),
      })

      pubsub.publish(MESSAGE_CREATED, { messageCreated: res })

      return res
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED),
    },
  },
}
