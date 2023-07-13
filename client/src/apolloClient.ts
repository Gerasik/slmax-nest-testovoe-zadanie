import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { createClient } from "graphql-ws"
import { getMainDefinition } from "@apollo/client/utilities"

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  })
)

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token")
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  })
  return forward(operation)
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
  link: concat(authMiddleware, splitLink),
  cache: new InMemoryCache(),
})

export default client
