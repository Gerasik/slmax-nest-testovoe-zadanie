const { AuthenticationError } = require("apollo-server")

const jwt = require("jsonwebtoken")

module.exports = (context) => {
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    const token = authHeader.split("Bearer")[1]

    if (token) {
      try {
        const user = jwt.verify(token, "UNSAFE_STRING")
        return user
      } catch (error) {
        throw new AuthenticationError("Invalid/Expired token")
      }
    }
    throw new AuthenticationError(
      "Authentication token must be `Bearer [token]` "
    )
  }
  throw new AuthenticationError("Authentication header must be provided")
}
