import jwt from "jsonwebtoken"

export default (context: any): any => {
  const authHeader: string | undefined = context.req.headers.authorization
  if (authHeader) {
    const token: string = authHeader.split("Bearer")[1].trim()

    if (token) {
      try {
        const user: any = jwt.verify(token, "UNSAFE_STRING")
        return user
      } catch (error) {
        throw new Error("Invalid/Expired token")
      }
    }
    throw new Error("Authentication token must be `Bearer [token]`")
  }
  throw new Error("Authentication header must be provided")
}
