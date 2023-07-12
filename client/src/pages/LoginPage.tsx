import React, { useContext, useEffect, useState } from "react"
import gql from "graphql-tag"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/authContext"
import { GraphQLErrors } from "@apollo/client/errors"
import { useMutation } from "@apollo/client"
import { useForm } from "../hooks/useForm"

const LOGIN_USER = gql`
  mutation Mutation($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      email
      token
      username
    }
  }
`

interface IRegisterFormValues {
  email: string
  password: string
}

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [errors, serErrors] = useState<GraphQLErrors>([])

  const registerUserCallback = () => {
    loginUser()
  }

  const { onChange, onSubmit, values } = useForm<IRegisterFormValues>(
    registerUserCallback,
    {
      email: "",
      password: "",
    }
  )

  const [loginUser, { data: userData }] = useMutation(LOGIN_USER, {
    onError({ graphQLErrors }) {
      serErrors(graphQLErrors)
    },
    variables: {
      loginInput: {
        email: values.email,
        password: values.password,
      },
    },
  })

  useEffect(() => {
    if (userData) {
      login(userData.loginUser)
      navigate("/")
    }
  }, [login, navigate, userData])

  return (
    <div className="w-full flex justify-center flex-col items-center">
      <div className="w-96">
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
        <button
          type="button"
          onClick={onSubmit}
          className="border-2 rounded-md"
        >
          Login
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

export default HomePage
