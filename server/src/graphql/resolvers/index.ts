import messagesResolvers from "./messages"
import userResolvers from "./users"
import { GraphQLUpload } from "graphql-upload-ts"

export default {
  Upload: GraphQLUpload,
  Query: {
    ...messagesResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...messagesResolvers.Mutation,
    ...userResolvers.Mutation,
  },
  Subscription: {
    ...messagesResolvers.Subscription,
  },
}
