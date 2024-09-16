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
    <div className="bg-[#ffffff] flex items-center justify-center p-4">
      <div className="bg-[#ffffff] p-2 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleSubmitUsers}
            className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200 w-full"
          >
            Administrar usuarios
          </button>
          <button
            onClick={handleSubmitLibros}
            className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200 w-full"
          >
            Administrar libro de consultas médicas
          </button>
          <button
            onClick={handleSubmitPagos}
            className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200 w-full"
          >
            Administrar pagos
          </button>
        </div>
      </div>
    </div>
  )
}

export default Administrador