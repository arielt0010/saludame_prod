import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logoSaludAME.jpg'

const ChangePassword = () => {
  const [values, setValues] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Función para manejar el cambio de los inputs
  const handleChange = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validación de la contraseña
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  // Manejo del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");  // Limpiar errores previos

    const { newPassword, confirmPassword } = values;

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar que la contraseña sea lo suficientemente fuerte
    if (!validatePassword(newPassword)) {
      setError("La contraseña debe tener al menos 8 caracteres, un número y un símbolo especial.");
      return;
    }

    // Enviar la nueva contraseña al backend
    axios.post('http://localhost:8081/change-password', { newPassword })
      .then(res => {
        if (res.data.Status === "PasswordChanged") {
          alert("Contraseña cambiada con éxito");
          navigate("/login");  // Redirige al login después de cambiar la contraseña
        } else {
          setError(res.data.Error);
        }
      })
      .catch(err => {
        console.error(err);
        setError("Error en el servidor");
      });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6">
      <img src={Logo} alt="Logo de la empresa" className="w-[400px] mb-6" /> 
      <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#063255] mb-6 text-center">Cambiar Contraseña</h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            name="newPassword"
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 
            focus:ring-[#009ab2] focus:border-[#009ab2]"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            name="confirmPassword"
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 
            focus:ring-[#009ab2] focus:border-[#009ab2]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-[#063255] text-white px-6 py-3 rounded-md hover:bg-[#004a6c] 
            transition-colors duration-200 w-full"
          >
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
