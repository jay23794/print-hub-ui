import { Routes, Route } from "react-router"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import ProfilePage from "./pages/ProfilePage"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default App
