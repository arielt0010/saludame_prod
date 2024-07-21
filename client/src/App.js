import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import HomeSistema from './pages/HomeSistema'
import Pagos from './pages/Pagos'
import Users from './pages/Users'
import UpdateUsers from './pages/UpdateUsers'
import LibroObservaciones from './pages/LibroObservaciones'
import UpdateDatosLibroObs from './pages/UpdateDatosLibroObs'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/create-user' element={<Register/>}></Route>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/start' element={<HomeSistema/>}></Route>
      <Route path='/pagos' element={<Pagos/>}></Route>
      <Route path='/users' element={<Users/>}></Route>
      <Route path='/updateUser/:id' element={<UpdateUsers/>}></Route>
      <Route path='/updateRegLibro/:id' element={<UpdateDatosLibroObs/>}></Route>
      <Route path='/libros' element={<LibroObservaciones/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App