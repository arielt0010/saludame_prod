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
        <button 
        className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200 w-full"
        onClick={handleSubmitLibros}>
        Administrar libro de observaciones
        </button>
        <button 
        className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200 w-full"
        onClick={handleSubmitPagos}>
        Administrar pagos
        </button>
    </div>
    )
}

export default Secretaria