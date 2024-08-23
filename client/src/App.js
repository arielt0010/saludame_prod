import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/users/Login';
import Register from './pages/users/Register';
import Home from './pages/Home';
import HomeSistema from './pages/HomeSistema';
import Seguro from './pages/paymentsClient/Seguro';
import Users from './pages/users/Users';
import UpdateUsers from './pages/users/UpdateUsers';
import LibroObservaciones from './pages/books/LibroObservaciones';
import UpdateDatosLibroObs from './pages/books/UpdateDatosLibroObs';
import Pagos from './pages/payments/Pagos';
import CreatePago from './pages/payments/CreatePago';
import CreateDatoLibro from './pages/books/CreateDatoLibro';
import Layout from './components/Layout';
import CreateClient from './pages/paymentsClient/CreateClient';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/start' element={<HomeSistema />} />
          <Route path='/seguro' element={<Seguro />} />
          <Route path='/create-user' element={<Register />} />
          <Route path='/users' element={<Users />} />
          <Route path='/updateUser/:id' element={<UpdateUsers />} />
          <Route path='/updateRegLibro/:id' element={<UpdateDatosLibroObs />} />
          <Route path='/libros' element={<LibroObservaciones />} />
          <Route path='/pagos' element={<Pagos />} />
          <Route path='/createPayment' element={<CreatePago />} />
          <Route path='/createClient' element={<CreateClient />} />
          <Route path='/createRegistro/:lid' element={<CreateDatoLibro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
