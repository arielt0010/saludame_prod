import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import HomeSistema from './pages/HomeSistema';
import Seguro from './pages/Seguro';
import Users from './pages/Users';
import UpdateUsers from './pages/UpdateUsers';
import LibroObservaciones from './pages/LibroObservaciones';
import UpdateDatosLibroObs from './pages/UpdateDatosLibroObs';
import Pagos from './pages/Pagos';
import CreatePago from './pages/CreatePago';
import CreateDatoLibro from './pages/CreateDatoLibro';
import Layout from './components/Layout';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/create-user' element={<Register />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/start' element={<HomeSistema />} />
          <Route path='/seguro' element={<Seguro />} />
          <Route path='/users' element={<Users />} />
          <Route path='/updateUser/:id' element={<UpdateUsers />} />
          <Route path='/updateRegLibro/:id' element={<UpdateDatosLibroObs />} />
          <Route path='/libros' element={<LibroObservaciones />} />
          <Route path='/pagos' element={<Pagos />} />
          <Route path='/createPayment' element={<CreatePago />} />
          <Route path='/createRegistro/:lid' element={<CreateDatoLibro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
