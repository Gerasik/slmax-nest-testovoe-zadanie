import { PubSub } from "graphql-subscriptions"
import Messages from "../../models/Message"
// import { finished } from "stream/promices"
import { finished } from "stream"
import { promisify } from "util"
import * as path from "path"

const messages = new Messages()

const pubsub = new PubSub()

const MESSAGE_CREATED = "MESSAGE_CREATED"

export default {
  Query: {
    messages(a: any, b: any, c: any, d: any) {
      console.log("🚀 ~ file: messages.ts:13 ~ messages ~ a,b,c,d:", c)
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
    singleUpload: async (parent: any, { file }: { file: any }) => {
      console.log("🚀 ~ file: messages.ts:40 ~ singleUpload: ~ file:", file)
      const { createReadStream, filename, mimetype, encoding } = await file

      const uploadDir = path.join(__dirname, "../../../public") // Specify the upload directory

      // Invoking the `createReadStream` will return a Readable Stream.
      // See https://nodejs.org/api/stream.html#stream_readable_streams
      const stream = createReadStream()

      // This is purely for demonstration purposes and will overwrite the
      // local-file-output.txt in the current working directory on EACH upload.
      const out = require("fs").createWriteStream(
        path.join(uploadDir, filename)
      )
      stream.pipe(out)

      const finishedAsync = promisify(finished)
      await finishedAsync(out)

      return { filename, mimetype, encoding }
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED),
    },
  },
}
