import { ApolloServer } from "apollo-server-express"
import { createServer } from "http"
import { MongoClient } from "mongodb"
import express from "express"
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/lib/use/ws"
import resolvers from "../graphql/resolvers"
import typeDefs from "../graphql/typeDefs"
// import Users from "../models/User"

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
    // dataSources: () => ({
    //   users: new Users(),
    // }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
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

// import { ApolloServer } from "@apollo/server"
// import { expressMiddleware } from "@apollo/server/express4"
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
// import { MongoClient } from 'mongodb'
// import { createServer } from "http"
// import express from "express"
// import { makeExecutableSchema } from "@graphql-tools/schema"
// import { WebSocketServer } from "ws"
// import { useServer } from "graphql-ws/lib/use/ws"
// import bodyParser from "body-parser"
// import cors from "cors"
// import resolvers from "../graphql/resolvers"
// import typeDefs from "../graphql/typeDefs"

// const PORT = 4000

// async function startServer() {
//   const client = new MongoClient('mongodb://localhost:27017/test')
// client.connect()
//   const schema = makeExecutableSchema({ typeDefs, resolvers })

//   const app = express()
//   const httpServer = createServer(app)

//   const wsServer = new WebSocketServer({
//     server: httpServer,
//     path: "/graphql",
//   })

//   const serverCleanup = useServer({ schema }, wsServer)

//   const server = new ApolloServer({
//     schema,
//     plugins: [
//       ApolloServerPluginDrainHttpServer({ httpServer }),
//       {
//         async serverWillStart() {
//           return {
//             async drainServer() {
//               await serverCleanup.dispose()
//             },
//           }
//         },
//       },
//     ],
//     dataSources: () => ({
//       users: new Users(client.db().collection('users'))
//       // OR
//       // users: new Users(UserModel)
//     })

//   })

//   await server.start()

//   app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server))

//   httpServer.listen(PORT, () => {
//     console.log(`Server is now running on http://localhost:${PORT}/graphql`)
//   })
// }

// startServer().catch((err) => {
//   console.error("Failed to start the server:", err)
// })

// import { ApolloServer } from "@apollo/server"
// import { expressMiddleware } from "@apollo/server/express4"
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
// import { createServer } from "http"
// import express from "express"
// import { makeExecutableSchema } from "@graphql-tools/schema"
// import { WebSocketServer } from "ws"
// import { useServer } from "graphql-ws/lib/use/ws"
// import bodyParser from "body-parser"
// import cors from "cors"
// import resolvers from "./graphql/resolvers"
// import typeDefs from "./graphql/typeDefs"

// // Create the schema, which will be used separately by ApolloServer and
// // the WebSocket server.
// const schema = makeExecutableSchema({ typeDefs, resolvers })

// // Create an Express app and HTTP server; we will attach both the WebSocket
// // server and the ApolloServer to this HTTP server.
// const app = express()
// const httpServer = createServer(app)

// // Create our WebSocket server using the HTTP server we just set up.
// const wsServer = new WebSocketServer({
//   server: httpServer,
//   path: "/graphql",
// })
// // Save the returned server's info so we can shutdown this server later
// const serverCleanup = useServer({ schema }, wsServer)

// // Set up ApolloServer.
// const server = new ApolloServer({
//   schema,
//   plugins: [
//     // Proper shutdown for the HTTP server.
//     ApolloServerPluginDrainHttpServer({ httpServer }),

//     // Proper shutdown for the WebSocket server.
//     {
//       async serverWillStart() {
//         return {
//           async drainServer() {
//             await serverCleanup.dispose()
//           },
//         }
//       },
//     },
//   ],
// })

// await server.start()
// app.use(
//   "/graphql",
//   cors<cors.CorsRequest>(),
//   bodyParser.json(),
//   expressMiddleware(server)
// )

// const PORT = 4000
// // Now that our HTTP server is fully set up, we can listen to it.
// httpServer.listen(PORT, () => {
//   console.log(`Server is now running on http://localhost:${PORT}/graphql`)
// })

// const { ApolloServer } = require("apollo-server")
// const mongoose = require("mongoose")

// const typeDefs = require("./graphql/typeDefs")
// const resolvers = require("./graphql/resolvers")

// const MONGODB =
//   "mongodb+srv://admin:admin@cluster0.myrdkev.mongodb.net/?retryWrites=true&w=majority"

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// })

// mongoose
//   .connect(MONGODB, { useNewUrlParser: true })
//   .then(() => {
//     console.log("MongoDB Connected")
//     return server.listen({ port: 3000 })
//   })
//   .then((res) => {
//     console.log(`Server running at ${res.url}`)
//   })
