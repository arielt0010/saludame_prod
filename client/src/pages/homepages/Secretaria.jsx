import React from 'react'
import { useNavigate } from 'react-router-dom'

const Secretaria = () => {
    const navigate = useNavigate()
    const handleSubmitLibros = () => {
        navigate('/libros')
    }
    const handleSubmitPagos = () => {
        navigate('/pagos')
    }
    return (
    <div>
        <button onClick={handleSubmitLibros}>Administrar libro de observaciones</button>
        <button onClick={handleSubmitPagos}>Administrar pagos</button>
    </div>
    )
}

export default Secretaria