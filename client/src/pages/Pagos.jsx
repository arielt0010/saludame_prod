import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Pagos = () => {
    axios.defaults.withCredentials = true;
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8081/pagos')
        .then(res => setData(res.data))
        .catch(err => alert(err))
    })
    const navigate = useNavigate();

    const handleDelete = (ID) => {
        axios.delete('http://localhost:8081/deletePayment/' + ID)
        .then(res => {
            console.log(res)
            navigate("/pagos")
        })
        .catch(err => console.log(err))
    }

    const handleCreate = () =>{
        navigate("/createPayment")
    }

    return (
        <div className="min-h-screen bg-[#ffffff] flex flex-col items-center p-6">
        <div className="w-full max-w-2x1 bg-[#ffffff] p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-[#063255] mb-6">Pagos realizados</h1>
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleCreate}
              className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200"
            >
              Crear pago
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#063255] text-white">
                  <th className="px-4 py-2 border">Id</th>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Colegio</th>
                  <th className="px-4 py-2 border">Curso</th>
                  <th className="px-4 py-2 border">Gestión</th>
                  <th className="px-4 py-2 border">Fecha de pago</th>
                  <th className="px-4 py-2 border">Monto</th>
                  <th className="px-4 py-2 border">Forma de pago</th>
                  <th className="px-4 py-2 border">Usuario</th>
                  <th className="px-4 py-2 border">Fecha agregado</th>
                  <th className="px-4 py-2 border">Acción</th>
                </tr>
              </thead>
              <tbody>
                {data.map((pagos, index) => (
                  <tr key={index} className="even:bg-gray-100">
                    <td className="px-4 py-2 border">{pagos.Id}</td>
                    <td className="px-4 py-2 border">{pagos.Nombre}</td>
                    <td className="px-4 py-2 border">{pagos.Colegio}</td>
                    <td className="px-4 py-2 border">{pagos.Curso}</td>
                    <td className="px-4 py-2 border">{pagos.Gestion}</td>
                    <td className="px-4 py-2 border">{pagos.fechaPago}</td>
                    <td className="px-4 py-2 border">{pagos.monto}</td>
                    <td className="px-4 py-2 border">{pagos.formaPago}</td>
                    <td className="px-4 py-2 border">{pagos.usuario}</td>
                    <td className="px-4 py-2 border">{pagos.fechaAgregado}</td>
                    <td className="px-4 py-2 border flex space-x-2">
                      <Link to={`/deletePayment/${pagos.Id}`}>
                        <button
                          onClick={() => handleDelete(pagos.Id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800 transition-colors duration-200"
                        >
                          Eliminar
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}

export default Pagos