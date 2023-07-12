export default `#graphql
  type Message {
    text: String
    createdAt: String
    createdBy: String
  }

  type User {
    username: String
    email: String
    password: String
    token: String
  }

  input MessageInput {
    text: String
    username: String
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
    message(id: ID!): Message
    user(id: ID!): User
  }

  type Mutation {
    createMessage(messageInput: MessageInput): Message!
    registerUser(registerInput: RegistryInput): User
    loginUser(loginInput: LoginInput): User
  }
`