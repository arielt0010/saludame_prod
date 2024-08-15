import React from 'react'
import { useNavigate } from 'react-router-dom'

const Medico = () => {
    const navigate = useNavigate()
    const handleSubmitLibros = () => {
        navigate('/libros')
    }
    return (
    <div className='bg-[#ffffff] flex items-center justify-center p-4'>
        <button onClick={handleSubmitLibros}
        className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200 w-full"
        >Administrar libro de observaciones</button>
    </div>
    )
}

export default Medico