import { Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import HomePage from './components/HomePage/HomePage'
import Login from './components/Login/Login'
import AuthProvider from './hooks/Auth/Auth'

function App() {

  return (
    <>
    <AuthProvider>
    <NavBar/>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
    </AuthProvider>
    </>
  )
}

export default App
