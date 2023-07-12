import messagesResolvers from "./messages"
import userResolvers from "./users"

export default {
  Query: {
    ...messagesResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...messagesResolvers.Mutation,
    ...userResolvers.Mutation,
  },
}
