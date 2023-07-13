import { ApolloServer } from "apollo-server-express"
import { createServer } from "http"
import express from "express"
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/lib/use/ws"
import resolvers from "./graphql/resolvers"
import typeDefs from "./graphql/typeDefs"

async function startServer() {
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const app = express()
  const httpServer = createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    context: ({ req }) => {
      // Get the user token from the headers.
      const token = req.headers.authorization || ""
      console.log("🚀 ~ file: index.ts:40 ~ startServer ~ token:", token)

      // Try to retrieve a user with the token
      // const user = getUser(token);

      // Add the user to the context
      // return { user };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  })
  await server.start()
  server.applyMiddleware({ app })

  const PORT = 4000
  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(
      `Server is now running on http://localhost:${PORT}${server.graphqlPath}`
    )
  })
}

startServer().catch((err) => {
  console.error("Failed to start the server:", err)
})
