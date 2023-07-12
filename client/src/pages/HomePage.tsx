import React, { useContext, useEffect } from "react"
import { AuthContext } from "../context/authContext"
import { useNavigate } from "react-router-dom"

const HomePage: React.FC = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [navigate, user])

  return <p>Home Page</p>
}

export default HomePage
