import React from 'react'
import { useNavigate } from 'react-router-dom'

const Medico = () => {
    const navigate = useNavigate()
    const handleSubmitLibros = () => {
        navigate('/libros')
    }
    return (
    <div>
        <button onClick={handleSubmitLibros}>Administrar libro de observaciones</button>
    </div>
    )
}

export default Medico