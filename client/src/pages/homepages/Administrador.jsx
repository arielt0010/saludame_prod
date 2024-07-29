import React from 'react'
import { useNavigate } from 'react-router-dom'

const Administrador = () => {
    const navigate = useNavigate()
    const handleSubmitUsers = () => {
        navigate('/users')
    }
    const handleSubmitLibros = () => {
        navigate('/libros')
    }
    const handleSubmitPagos = () => {
        navigate('/pagos')
    }
    return (
    <div>
        <button onClick={handleSubmitUsers}>Administrar usuarios</button>
        <button onClick={handleSubmitLibros}>Administrar libro de observaciones</button>
        <button onClick={handleSubmitPagos}>Administrar pagos</button>
    </div>
  )
}

export default Administrador