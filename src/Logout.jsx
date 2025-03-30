import { useEffect } from "react"
import auth from "./services/authentication/authService"
import { Navigate } from "react-router-dom"

export const Logout = () => {
  
  const logout = () => {
    auth.logout()
  }

  useEffect(() => {
    logout()
  }, [])

  return <Navigate to={'/'}/>
}