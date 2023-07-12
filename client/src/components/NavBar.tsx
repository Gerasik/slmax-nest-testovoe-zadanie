import React, { useContext } from "react"
import { Outlet, NavLink } from "react-router-dom"
import { AuthContext } from "../context/authContext"

const NavBar: React.FC = () => {
  const { user, logout } = useContext(AuthContext)
  const activeClass = ""
  const inActiveClass = "text-slate-400"

  return (
    <div>
      <nav className="flex justify-center border-b-2 p-4 justify-between">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeClass : inActiveClass)}
        >
          Home
        </NavLink>
        <div className="flex flex-row gap-3 text-lg">
          {user ? (
            <button onClick={logout} className="pointer ">
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? activeClass : inActiveClass
                }
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? activeClass : inActiveClass
                }
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  )
}

export default NavBar
