import React from 'react'
import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const [values, setValues] = useState({
    name : "",
    user: "",
    password: "",
    rid_fk:""
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
    <div className="auth">
    <h1 className="login"> Crear usuario
      <form action="">
        <input required type="text" placeholder="nombre" name="name" id="" onChange={handleChange}/>
        <input type="text" placeholder="username" name="user" id=""onChange={handleChange} />
        <input type="password" placeholder="password" name="password" id="" onChange={handleChange}/>
        <select name="rid_fk" onChange={handleChange}> 
          <option value="">Seleccione Rol</option>
          <option value="1">Administrador</option>
          <option value="2">Gerente</option>
          <option value="3">Medico</option>
          <option value="4">Secretaria</option>
    </select>
        <button onClick={handleSubmit} className='btnRegister'>Registrar</button>
        <button className="btnBack"><Link to="/">Volver a inicio</Link></button>
      </form>
    </h1>
  </div>
  )
}

export default Register