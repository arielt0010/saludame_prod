import axios from 'axios'
import React, { useEffect, useState } from 'react'
import '../styles/Users.css'
import { Link, useNavigate } from 'react-router-dom'

const Users = () => {
    axios.defaults.withCredentials = true;
    const [data, setData] = useState([])
    useEffect(() => {    
        axios.get('http://localhost:8081/users')
        .then(res => setData(res.data))
        .catch(err => alert(err))}
    ,[])
    const navigate = useNavigate();

    const handleDelete = (ID) => {
        axios.delete('http://localhost:8081/deleteUser/' + ID)
        .then(res => {
            console.log(res)
            navigate("/users")
        })
        .catch(err => console.log(err))
    }

  return (
    <div className='mainDiv'>
        <div className='containter'>
            <h2>Usuarios</h2>
            <div>
                <button className='createButton'><Link to="/create-user">Crear usuario</Link></button>
            </div>
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((usuario, index) => {
                        return <tr key={index}>
                                <td>{usuario.ID}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.usuario}</td>
                                <td>{usuario.Rol}</td>
                                <td>
                                    <button className='btnEditar'><Link to={`/updateUser/${usuario.ID}`}>Editar</Link></button>
                                    <button onClick={ () => handleDelete(usuario.ID)} className='btnEliminar'><Link to={`/deleteUser/${usuario.ID}`}>Eliminar</Link></button>
                                </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Users