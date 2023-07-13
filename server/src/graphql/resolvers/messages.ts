import { PubSub } from "graphql-subscriptions"
import Messages from "../../models/Message"

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
