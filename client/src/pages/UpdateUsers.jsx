import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const UpdateUsers = () => {
    axios.defaults.withCredentials = true;

    //handle getting id
    const {id} = useParams();

    useEffect(() => {
        axios.get('http://localhost:8081/users/' + id)
        .then(res => {
           setValues({...values, name: res.data[0].nombre, user: res.data[0].usuario, ridFK : res.data[0].ridFK, estado: res.data[0].estado, apellidoPaterno: res.data[0].apellidoPaterno, apellidoMaterno: res.data[0].apellidoMaterno})
        }).catch(err =>console.log(err))
    }, [id])

    //handle update
    const [values, setValues] = useState({
        name : '',
        user: '',
        ridFK: '',
        password: '',
        estado: '',
        apellidoPaterno: '',
        apellidoMaterno: ''
      })
      const handleChange = e => {
        setValues(prev=>({...prev, [e.target.name]: e.target.value}))
      }
      const navigate = useNavigate()
      const handleUpdate = e => {
        e.preventDefault();
        axios.put('http://localhost:8081/update/' +id, values)
        .then(res => {
          if(res.data.Status === "Success"){
            navigate("/users")
          }else{
            console.log(res.data.Error)
            navigate("/users")
          }
        })
        .then(err => console.log(err));
      }    
    return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Actualizar usuario</h1>
        <form className="space-y-4">
          <div>
            <input
              required
              type="text"
              placeholder="Nombre"
              name="name"
              onChange={handleChange}
              value={values.name}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              required
              type="text"
              placeholder="Apellido Paterno"
              name="apellidoPaterno"
              onChange={handleChange}
              value={values.apellidoPaterno}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              required
              type="text"
              placeholder="Apellido Materno"
              name="apellidoMaterno"
              onChange={handleChange}
              value={values.apellidoMaterno}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              required
              type="text"
              placeholder="Username"
              name="user"
              onChange={handleChange}
              value={values.user}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Change password? Leave blank if not"
              name="password"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              name="ridFK"
              onChange={handleChange}
              value={values.ridFK}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione Rol</option>
              <option value="1">Administrador</option>
              <option value="2">Gerente</option>
              <option value="3">Médico</option>
              <option value="4">Secretaria</option>
            </select>
          </div>
          <div>
            <select
              name="estado"
              onChange={handleChange}
              value={values.estado}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione Estado</option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 w-full"
            >
              Actualizar
            </button>
            <Link to="/users">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 w-full"
              >
                Volver atrás
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>

  )
}

export default UpdateUsers