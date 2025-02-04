import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/users/Login';
import Register from './pages/users/Register';
import ChangePassword from './pages/users/ChangePassword';
import PasswordResetRequest from './pages/users/PasswordRequest';
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
import UploadPagos from './pages/paymentsClient/UploadPagos';
import UpdateDatosTutor from './pages/paymentsClient/UpdateDatosTutor';
import Done from './pages/paymentsClient/Done';
import OfflineNotification from './components/Offline';
import DownloadRecibo from './pages/paymentsClient/DownloadRecibo';

const App = () => {
  return (
    <BrowserRouter>
      <OfflineNotification />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/reset-password' element={<PasswordResetRequest />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/start' element={<HomeSistema />} />
          <Route path='/seguro' element={<Seguro />} />
          <Route path='/subirPagos' element={<UploadPagos />} />
          <Route path='/create-user' element={<Register />} />
          <Route path='/users' element={<Users />} />
          <Route path='/updateUser/:id' element={<UpdateUsers />} />
          <Route path='/updateRegLibro/:id' element={<UpdateDatosLibroObs />} />
          <Route path='/libros' element={<LibroObservaciones />} />
          <Route path='/pagos' element={<Pagos />} />
          <Route path='/createPayment' element={<CreatePago />} />
          <Route path='/createClient' element={<CreateClient />} />
          <Route path='/createRegistro/:lid' element={<CreateDatoLibro />} />
          <Route path='/datosTutor/' element={<UpdateDatosTutor />} />
          <Route path='/hecho' element={<Done />} />
          <Route path='/downloadRecibo' element={<DownloadRecibo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
