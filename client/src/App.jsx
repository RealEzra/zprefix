import { Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import HomePage from './components/HomePage/HomePage'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import Profile from './components/Profile/Profile'
import Item from './components/Item/Item'

function App() {

  return (
    <>
    <NavBar/>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/sign-up" element={<SignUp/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/item/:id" element={<Item/>}/>
    </Routes>
    </>
  )
}

export default App
