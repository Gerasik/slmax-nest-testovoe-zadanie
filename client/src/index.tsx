import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import client from "./apolloClient"
import { ApolloProvider } from "@apollo/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/authContext"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import NavBar from "./components/NavBar"

const router = createBrowserRouter([
  {
    path: "",
    element: <NavBar />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <AuthProvider>
    <ApolloProvider client={client}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </ApolloProvider>
  </AuthProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
