import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import AuthProvider from './features/auth/AuthProvider'
import { useAuth } from './features/auth/authContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import './App.css'

function AccountPages() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p role="status">Checking your session…</p>
  if (!session) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return <Outlet />
}

function AppRoutes() {
  const { session } = useAuth()

  return (
    <>
      <Navbar isLoggedIn={Boolean(session)} />
      <main>
        <Routes>
          <Route path="/" element={<h1>PlainSpeak</h1>} />
          <Route path="/login" element={<Login />} />
          <Route element={<AccountPages />}>
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
