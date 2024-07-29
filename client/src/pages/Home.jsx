import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Bienvenid@.</h1>
      <button className='btnUsuarios'><Link to='/login'>Usuarios del sistema</Link></button>
      <button className='btnCancelarSeguro'><Link to='/seguro'>Cancelar seguro</Link></button>
    </div>
  )
}

export default Home