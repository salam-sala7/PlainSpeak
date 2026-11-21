import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Navbar from './components/Navbar'
import AuthProvider from './features/auth/AuthProvider'
import { useAuth } from './features/auth/authContext'
import Home from './pages/Home'
import Professionals from './pages/Professionals'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Submit from './pages/Submit'
import Register from './pages/Register'
import './App.css'

function AppRoutes() {
  const { session } = useAuth()

  return (
    <>
      <Navbar isLoggedIn={Boolean(session)} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<Home />} />
          <Route path="/professionals" element={<Professionals />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/submit" element={<Submit />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>
}
