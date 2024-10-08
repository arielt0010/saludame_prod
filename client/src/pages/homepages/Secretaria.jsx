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
    <div className="bg-[#ffffff] p-2 rounded-lg shadow-lg w-full max-w-lg flex flex-col space-y-2">
        <button 
        className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200 w-full"
        onClick={handleSubmitLibros}>
        Administrar libro de consultas médicas
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