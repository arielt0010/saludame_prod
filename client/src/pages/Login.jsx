import axios from 'axios'
import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

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
    <div className="auth">
    <h1 className="login"> Usuarios del sistema
      <form action="">
        <input type="text" placeholder="username" name="user" id="user"onChange={handleChange} />
        <input type="password" placeholder="password" name="password" id="pass" onChange={handleChange}/>
        <button onClick={handleSubmit} className='btnRegister'>Registrar</button>
        <button className="btnBack"><Link to="/">Volver a inicio</Link></button>
      </form>
    </h1>
  </div>
  )
}

export default Login