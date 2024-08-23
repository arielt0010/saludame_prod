import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Users = () => {
    axios.defaults.withCredentials = true;
    const [data, setData] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/users')
            .then(res => {
                if (Array.isArray(res.data)) {
                    setData(res.data);
                } else {
                    alert("Error al cargar los datos");
                }
            })
            .catch(err => alert(err))
    }, [])

    return (
    <div>
        <div className="min-h-screen bg-[#ffffff] p-6 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-[#f8f9fa] p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-[#063255] mb-4"></h2>
          <div className="flex justify-end mb-4">
            <Link to="/create-user">
              <button className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200">
                Crear usuario
              </button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#063255] text-white">
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Nombre</th>
                  <th className="py-2 px-4 text-left">Apellido Paterno</th>
                  <th className="py-2 px-4 text-left">Apellido Materno</th>
                  <th className="py-2 px-4 text-left">Usuario</th>
                  <th className="py-2 px-4 text-left">Rol</th>
                  <th className="py-2 px-4 text-left">Estado</th>
                  <th className="py-2 px-4 text-left">Accion</th>
                </tr>
              </thead>
              <tbody>
                {data.map((usuario, index) => (
                  <tr key={index} className="border-b last:border-none">
                    <td className="py-2 px-4">{usuario.ID}</td>
                    <td className="py-2 px-4">{usuario.nombre}</td>
                    <td className="py-2 px-4">{usuario.apellidoPaterno}</td>
                    <td className="py-2 px-4">{usuario.apellidoMaterno}</td>
                    <td className="py-2 px-4">{usuario.usuario}</td>
                    <td className="py-2 px-4">{usuario.Rol}</td>
                    <td className="py-2 px-4">{usuario.Estado}</td>
                    <td className="py-2 px-4 space-x-2">
                      <Link to={`/updateUser/${usuario.ID}`}>
                        <button className="bg-[#009ab2] text-white px-3 py-1 rounded-md hover:bg-[#007a8a] transition-colors duration-200">
                          Editar
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
    </div>
    )
}

export default Users
