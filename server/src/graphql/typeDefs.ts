import { gql } from "apollo-server-core"

export default gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Message {
    id: Int
    room: Int
    text: String
    createdAt: String
    createdBy: String
    files: [String]
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
    singleUpload(file: Upload!): File!
  }

  type Subscription {
    messageCreated: Message
  }
`
