import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import HomeSistema from './pages/HomeSistema'
import Pagos from './pages/Pagos'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/start' element={<HomeSistema/>}></Route>
      <Route path='/pagos' element={<Pagos/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App