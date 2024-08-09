import axios from 'axios';
import React from 'react'

const Seguro = () => {
  axios.defaults.withCredentials = true;

  return (
    
    <div>
      <h1>Cancela tu seguro</h1>
      <h2>Escribe el nombre completo del cliente</h2>
      <input type="text" name="name" placeholder="Nombre" />
      <input type="text" name="apellidoPaterno" placeholder="Apellido Paterno" />
      <input type="text" name="apellidoMaterno" placeholder="apellido Materno" />
      <button>Enviar</button>
    </div>
  )
}

export default Seguro