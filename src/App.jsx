import React from "react"
import { Routes, Route, Navigate } from "react-router"
import { LoginScreen } from "./Screens/LoginScreen/LoginScreen"
import { RegisterScreen } from "./Screens/RegisterScreen/RegisterScreen"
import { HomeScreen } from "./Screens/HomeScreen/HomeScreen"
import { ResetPasswordScreen } from "./Screens/ResetPasswordScreen/ResetPasswordScreen"
import { AuthContextProvider } from "./context/AuthContext"
import AuthMiddleware from "./middlewares/AuthMiddleware"
import AlreadyAuthMiddleware from "./middlewares/AlreadyAuthMiddleware"

const App = () => {
  return (
    <AuthContextProvider>
      <Routes>
        <Route element={<AlreadyAuthMiddleware />}>
          <Route
            path="/login"
            element={<LoginScreen />}
          />
          <Route
            path="/register"
            element={<RegisterScreen />}
          />
          <Route
            path="/reset-password"
            element={<ResetPasswordScreen />}
          />
          <Route
            path="/"
            element={<LoginScreen />}
          />
        </Route>
        <Route
          element={<AuthMiddleware />}
        >
          <Route
            path="/workspaces"
            element={<HomeScreen />}
          />
        </Route>
        <Route
          path="/*"
          element={<Navigate to={'/workspaces'} />} // si no EXISTE el apartado me redirecciona a workspaces
        />
      </Routes>
    </AuthContextProvider>
  )
}

export default App