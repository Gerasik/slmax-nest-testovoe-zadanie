import React, { useReducer, createContext, Reducer, ReactNode } from "react"

import jwtDecode from "jwt-decode"

export interface IUser {
  exp?: number
  token?: string
  username?: string
  password?: string
}

interface IInitialState {
  user: IUser | null
}

type IAction =
  | {
      type: "LOGIN"
      payload?: IUser
    }
  | {
      type: "LOGOUT"
    }

const initialState: IInitialState = {
  user: null,
}

if (localStorage.getItem("token")) {
  const decodedToken = jwtDecode<{ exp: number; user: string }>(
    localStorage.getItem("token") as string
  )

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("token")
  } else {
    initialState.user = decodedToken
  }
}

const authReducer: Reducer<IInitialState, IAction> = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        user: action.payload,
      } as IInitialState
    }

    case "LOGOUT": {
      return {
        ...state,
        user: null,
      }
    }
    default: {
      return state
    }
  }
}

const AuthContext = createContext<
  IInitialState & { login: (userDate: IUser) => void; logout: () => void }
>({
  user: null,
  login: (userData: IUser) => {
    console.log("12312")
  },
  logout: () => {},
})

const AuthProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = (userData: IUser) => {
    console.log(userData, "adsds")
    localStorage.setItem("token", userData.token ?? "")
    dispatch({
      type: "LOGIN",
      payload: userData,
    })
  }

  const logout = () => {
    localStorage.removeItem("token")

    dispatch({
      type: "LOGOUT",
    })
  }

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
