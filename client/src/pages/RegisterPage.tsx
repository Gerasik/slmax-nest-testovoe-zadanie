import gql from "graphql-tag"
import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/authContext"
import { useNavigate } from "react-router"
import { useMutation } from "@apollo/client"
import { GraphQLErrors } from "@apollo/client/errors"
import { useForm } from "../hooks/useForm"

const REGISTER_USER = gql`
  mutation Mutation($registerInput: RegistryInput) {
    registerUser(registerInput: $registerInput) {
      email
      token
      username
    }
  }
`

interface IRegisterFormValues {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const RegisterPage: React.FC = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [errors, serErrors] = useState<GraphQLErrors>([])

  const registerUserCallback = () => {
    registerUser()
  }

  const { onChange, onSubmit, values } = useForm<IRegisterFormValues>(
    registerUserCallback,
    {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  )

  const [registerUser, { data: userData }] = useMutation(REGISTER_USER, {
    onError({ graphQLErrors }) {
      serErrors(graphQLErrors)
    },
    variables: {
      registerInput: {
        username: values.username,
        email: values.email,
        password: values.password,
      },
    },
  })

  useEffect(() => {
    if (userData) {
      login(userData.registerUser)
      navigate("/")
    }
  }, [login, navigate, userData])

  return (
    <div className="w-full flex justify-center flex-col items-center">
      <div className="w-96">
        <div className="flex justify-between">
          <label htmlFor="username">Username</label>
          <input
            name="username"
            className="border-2 rounded-md"
            type="text"
            onChange={onChange}
          />
        </div>
        <div className="flex justify-between">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="text"
            className="border-2 rounded-md"
            onChange={onChange}
          />
        </div>
        <div className="flex justify-between">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            className="border-2 rounded-md"
            onChange={onChange}
          />
        </div>
        <div className="flex justify-between">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            name="confirmPassword"
            type="password"
            className="border-2 rounded-md"
            onChange={onChange}
          />
        </div>
        <button
          type="button"
          onClick={onSubmit}
          className="border-2 rounded-md"
        >
          Create user
        </button>
      </div>
      {errors.map((error) => (
        <p
          className="bg-red-500 text-white px-3 rounded-sm m-3"
          key={error.message}
        >
          {error.message}
        </p>
      ))}
    </div>
  )
}

export default RegisterPage
