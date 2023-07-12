const { ApolloServer } = require("apollo-server")
const mongoose = require("mongoose")

const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")

const MONGODB =
  "mongodb+srv://admin:admin@cluster0.myrdkev.mongodb.net/?retryWrites=true&w=majority"

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected")
    return server.listen({ port: 3000 })
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`)
  })
