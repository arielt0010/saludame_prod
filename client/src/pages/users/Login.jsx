import axios from 'axios'
import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Logo from '../../assets/logoSaludAME.jpg'

const Login = () => {
  axios.defaults.withCredentials = true;
  const [values, setValues] = useState({
    user: "",
    password: ""
  })
  const handleChange = e => {
    setValues(prev=>({...prev, [e.target.name]: e.target.value}))
    console.log(values)
  }
  const navigate = useNavigate();
  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:8081/login', values)
    .then(res => {
      if(res.data.Status === "Success"){
        navigate("/start")
      }else{
        alert(res.data.Error)
      }
    })
    .then(err => console.log(err))
  }
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
          <Link to="/">
            <button className="bg-[#009ab2] text-white px-6 py-3 rounded-md hover:bg-[#007a8a] 
            transition-colors duration-200 w-full">
              Volver a inicio
            </button>
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Login