import Message from "../../models/Message"

export default {
  Mutation: {
    async createMessage(
      _: any,
      {
        messageInput: { text, username },
      }: { messageInput: { text: string; username: string } }
    ) {
      const newMessage = new Message({
        text: text,
        createdBy: username,
        createdAt: new Date().toISOString(),
      })

      const res = await newMessage.save()
      console.log(res)
      return {
        id: res.id,
        ...res._doc,
      }
    },
  },
  Query: {
    message: (_: any, { ID }: { ID: number }) => Message.findById(ID),
  },
}
