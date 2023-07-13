import { gql } from "apollo-server-core"

export default gql`
  type Message {
    id: Int
    room: Int
    text: String
    createdAt: String
    createdBy: String
  }

  type User {
    id: Int
    username: String
    email: String
    password: String
    token: String
  }

  input MessageInput {
    text: String
    username: String
    room: Int!
  }

  input RegistryInput {
    username: String
    email: String
    password: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Query {
    messages: [Message]
    user(id: ID!): User
  }

  type Mutation {
    createMessage(messageInput: MessageInput): Message!
    registerUser(registerInput: RegistryInput): User
    loginUser(loginInput: LoginInput): User
  }

  type Subscription {
    messageCreated: Message
  }
`