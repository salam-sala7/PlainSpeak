import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AuthProvider from './features/auth/AuthProvider'
import { useAuth } from './features/auth/authContext'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function AppRoutes() {
  const { session } = useAuth()

  return (
    <>
      <Navbar isLoggedIn={Boolean(session)} />
      <main>
        <Routes>
          <Route path="/" element={<h1>PlainSpeak</h1>} />
          <Route path="/login" element={<Login />} />
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
