import React from 'react'
import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const [values, setValues] = useState({
    name : "",
    apellidoMaterno: "",
    apellidoPaterno: "",
    user: "",
    password: "",
    ridFK:"",
    estado: ""
  })
  const handleChange = e => {
    setValues(prev=>({...prev, [e.target.name]: e.target.value}))
  }
  const navigate = useNavigate();
  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:8081/createUser', values)
    .then(res => {
      console.log(res)
      navigate("/users")
    })
    .then(err => {
      console.log(err)
      navigate("/users")
    });
  }

  return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6">
        <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#063255] mb-6 text-center">Crear usuario</h1>
          <form className="flex flex-col space-y-4">
            <input
              required
              type="text"
              placeholder="Nombre"
              name="name"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] focus:border-[#009ab2]"
            />
            <input
              required
              type="text"
              placeholder="Apellido Paterno"
              name="apellidoPaterno"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] focus:border-[#009ab2]"
            />
            <input
              required
              type="text"
              placeholder="Apellido Materno"
              name="apellidoMaterno"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] focus:border-[#009ab2]"
            />
            <input
              required
              type="text"
              placeholder="Usuario"
              name="user"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] focus:border-[#009ab2]"
            />
            <input
              required
              type="password"
              placeholder="Contraseña"
              name="password"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] focus:border-[#009ab2]"
            />
            <select
              required
              name="ridFK"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] focus:border-[#009ab2]"
            >
              <option value="">Seleccione Rol</option>
              <option value="1">Administrador</option>
              <option value="2">Gerente</option>
              <option value="3">Medico</option>
              <option value="4">Secretaria</option>
            </select>
            <select
              required
              name="estado"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2] focus:border-[#009ab2]"
            >
              <option value="">Seleccione Estado</option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
            <button
              onClick={handleSubmit}
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
  )
}

export default Register