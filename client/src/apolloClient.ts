import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { createClient } from "graphql-ws"
import { setContext } from "@apollo/client/link/context"
import { getMainDefinition } from "@apollo/client/utilities"

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  })
)

const authLink = setContext((_, { header }) => {
  return {
    header: { ...header, authorization: localStorage.getItem("token") || "" },
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
})

export default client
