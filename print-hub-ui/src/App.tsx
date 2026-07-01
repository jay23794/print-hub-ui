import { Routes, Route, Navigate } from "react-router"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import ProfilePage from "./pages/ProfilePage"
import GamePreviewPage from "./pages/GamePreviewPage"
import PrintConfigsPage from "./pages/PrintConfigsPage"
import PrintConfigFormPage from "./pages/PrintConfigFormPage"
import { useAuth } from "./contexts/AuthContext"
import type { JSX } from "react"

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      {/* TEMP: game UI preview */}
      <Route path="/game-preview" element={<GamePreviewPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/print-configs"
        element={
          <PrivateRoute>
            <PrintConfigsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/print-configs/new"
        element={
          <PrivateRoute>
            <PrintConfigFormPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/print-configs/:id/edit"
        element={
          <PrivateRoute>
            <PrintConfigFormPage />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
