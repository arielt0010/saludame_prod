import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../assets/logoSaludAME.jpg'
import { ToastContainer } from 'react-toastify';  // Importar Toastify
import 'react-toastify/dist/ReactToastify.css';          // Importar estilos de Toastify

const Login = () => {
  axios.defaults.withCredentials = true;
  const [values, setValues] = useState({
    user: "",
    password: ""
  });
  const handleChange = e => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:8081/login', values)
      .then(res => {
        if (res.data.Status === "Success") {
          navigate("/start");  // Redirige al dashboard si el login es exitoso
        } else if (res.data.Status === "PasswordChangeRequired") {
          navigate("/change-password");  // Redirige a la página de cambio de contraseña
        } else {
          alert(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const handlePasswordReset = () => {
    navigate("/reset-password");
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6">
      <img src={Logo} alt="Logo de la empresa" className="w-[400px] mb-6" /> 
      <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#063255] mb-6 text-center">Usuarios del sistema</h1>
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            name="user"
            id="user"
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 
            focus:ring-[#009ab2] focus:border-[#009ab2]"
          />
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            id="pass"
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 
            focus:ring-[#009ab2] focus:border-[#009ab2]"
          />
          <button
            onClick={handleSubmit}
            className="bg-[#063255] text-white px-6 py-3 rounded-md hover:bg-[#004a6c] 
            transition-colors duration-200 w-full"
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            onClick={handlePasswordReset}
            className="bg-[#f56565] text-white px-6 py-3 rounded-md hover:bg-[#c53030] 
            transition-colors duration-200 w-full"
          >
            Restablecer contraseña
          </button>

          <Link to="/">
            <button className="bg-[#009ab2] text-white px-6 py-3 rounded-md hover:bg-[#007a8a] 
            transition-colors duration-200 w-full">
              Volver a inicio
            </button>
          </Link>
        </form>
      </div>

      {/* Contenedor de Toast para mostrar las notificaciones */}
      <ToastContainer />
    </div>
  );
}

export default Login;
