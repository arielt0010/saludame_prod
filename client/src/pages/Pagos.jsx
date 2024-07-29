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
    <div className='main'>
        <h1 className='title'>Pagos realizados</h1>
        <div>
            <button className='createPago' onClick={handleCreate}>Crear pago</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Colegio</th>
                    <th>Curso</th>
                    <th>Gestion</th>
                    <th>Fecha de pago</th>
                    <th>Monto</th>
                    <th>Forma de pago</th>
                    <th>Usuario</th>
                    <th>Fecha agregado</th>
                    <th>Accion</th>
                </tr>
            </thead>
            <tbody>
                {data.map((pagos, index) => {
                        return <tr key={index}>
                                <td>{pagos.Id}</td>
                                <td>{pagos.Nombre}</td>
                                <td>{pagos.colegio}</td>
                                <td>{pagos.curso}</td>
                                <td>{pagos.gestion}</td>
                                <td>{pagos.fechaPago}</td>
                                <td>{pagos.monto}</td>
                                <td>{pagos.formaPago}</td>
                                <td>{pagos.usuario}</td>
                                <td>{pagos.fechaAgregado}</td>
                                <td>
                                    <button onClick={ () => handleDelete(pagos.Id)} className='btnEliminar'><Link to={`/deletePayment/${pagos.Id}`}>Eliminar</Link></button>
                                </td>
                        </tr>
                    })}
            </tbody>
        </table>
    </div>
  )
}

export default Pagos