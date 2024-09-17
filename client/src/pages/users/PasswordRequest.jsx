import React, { useState } from 'react';
import axios from 'axios';
import Logo from '../../assets/logoSaludAME.jpg'
import {Link} from 'react-router-dom'

const PasswordResetRequest = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Llama al endpoint del backend para activar la bandera de restablecimiento de contraseña
    axios.put('http://localhost:8081/reset-password', { user: username })
      .then(res => {
        if (res.data.Status === "Solicitud enviada") {
          setMessage("Se ha enviado tu solicitud de restablecimiento. Por favor, contacta al administrador.");
        } else {
          setMessage("Error: " + res.data.Error);
        }
      })
      .catch(err => {
        setMessage("Error en la solicitud. Intenta nuevamente.");
      });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6">
      <img src={Logo} alt="Logo de la empresa" className="w-[400px] mb-6" />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Restablecer Contraseña</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu nombre de usuario"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors duration-200 w-full"
          >
            Solicitar restablecimiento
          
          </button>
          <Link to="/">
            <button className="bg-[#009ab2] text-white px-6 py-3 rounded-md hover:bg-[#007a8a] 
            transition-colors duration-200 w-full mt-4">
              Volver a inicio
            </button>
          </Link>
        </form>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordResetRequest;
