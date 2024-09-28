import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [values, setValues] = useState({
    name: "",
    apellidoMaterno: "",
    apellidoPaterno: "",
    user: "",
    password: "",
    ridFK: "",
    estado: "Activo"
  });

  const [fieldErrors, setFieldErrors] = useState({}); // Nuevo estado para los errores de campos

  const handleChange = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateFields = () => {
    const errors = {};
    if (!values.name) errors.name = true;
    if (!values.apellidoPaterno) errors.apellidoPaterno = true;
    if (!values.apellidoMaterno) errors.apellidoMaterno = true;
    if (!values.user) errors.user = true;
    if (!values.password) errors.password = true;
    if (!values.ridFK) errors.ridFK = true;
    if (!values.estado) errors.estado = true;

    setFieldErrors(errors); // Actualiza los errores en el estado
    return Object.keys(errors).length === 0; // Devuelve true si no hay errores
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateFields()) {
      console.log("Por favor, completa todos los campos requeridos.");
      return; // No proceder si hay errores
    }

    axios.post('http://localhost:8081/createUser', values)
      .then(res => {
        console.log(res);
        navigate("/users");
      })
      .catch(err => {
        console.log(err);
        navigate("/users");
      });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-2">
      <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col space-y-2">
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            name="name"
            onChange={handleChange}
            className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          <input
            type="text"
            placeholder="Apellido Paterno"
            name="apellidoPaterno"
            onChange={handleChange}
            className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] ${fieldErrors.apellidoPaterno ? 'border-red-500' : 'border-gray-300'}`}
          />
          <input
            type="text"
            placeholder="Apellido Materno"
            name="apellidoMaterno"
            onChange={handleChange}
            className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] ${fieldErrors.apellidoMaterno ? 'border-red-500' : 'border-gray-300'}`}
          />
          <input
            type="text"
            placeholder="Usuario"
            name="user"
            onChange={handleChange}
            className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] ${fieldErrors.user ? 'border-red-500' : 'border-gray-300'}`}
          />
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            onChange={handleChange}
            className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          <select
            name="ridFK"
            onChange={handleChange}
            className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] ${fieldErrors.ridFK ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Seleccione Rol</option>
            <option value="1">Administrador</option>
            <option value="2">Gerente</option>
            <option value="3">Medico</option>
            <option value="4">Secretaria</option>
          </select>
          <select
            name="estado"
            onChange={handleChange}
            className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] ${fieldErrors.estado ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Seleccione Estado</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
          <button
            type="submit"
            className="bg-[#063255] text-white px-6 py-3 rounded-md hover:bg-[#004a6c] transition-colors duration-200 w-full"
          >
            Registrar
          </button>
          <Link to="/users">
            <button className="bg-[#009ab2] text-white px-6 py-3 rounded-md hover:bg-[#007a8a] transition-colors duration-200 w-full">
              Volver atrás
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
