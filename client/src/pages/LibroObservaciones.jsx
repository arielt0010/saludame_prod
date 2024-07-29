import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'

const DropdownSelection = () => {
    axios.defaults.withCredentials = true;
    const [data, setData] = useState([]);
    const [colegio, setColegio] = useState('');
    const [gestion, setGestion] = useState('');
    const [mes, setMes] = useState('');
    const [details, setDetails] = useState(null);   //detalles del libro de observaciones

    useEffect(() => {
        // Obtener los datos del backend
        axios.get('http://localhost:8081/libros')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }, []);

    const handleSubmit = async () => {
        try{
            const res = await axios.get(`http://localhost:8081/libros/filter?colegio=${colegio}&gestion=${gestion}&mes=${mes}`);
            const lid = res.data.lid;
            const observacionesResponse = await axios.get(`http://localhost:8081/libros/${lid}`);
            setDetails(observacionesResponse.data);
        }catch(err){
            alert(err)
        }
    }

    const navigate = useNavigate();
    
    const handleDelete = (ID) => {
        axios.delete('http://localhost:8081/deleteRegLibro/' + ID)
        .then(res => {
            console.log(res)
            window.location.reload()
            navigate("/libros")
        })
        .catch(err => console.log(err))
    }

    return (
        <div>
            <div>
                <label>Colegio:</label>
                <select value={colegio} onChange={(e) => setColegio(e.target.value)}>
                    <option value="">Seleccione un colegio</option>
                    {Array.from(new Set(data.map(item => item.colegio))).map(colegio => (
                        <option key={colegio} value={colegio}>{colegio}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Gestión:</label>
                <select value={gestion} onChange={(e) => setGestion(e.target.value)}>
                    <option value="">Seleccione una gestión</option>
                    {Array.from(new Set(data.map(item => item.gestion))).map(gestion => (
                        <option key={gestion} value={gestion}>{gestion}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Mes:</label>
                <select value={mes} onChange={(e) => setMes(e.target.value)}>
                    <option value="">Seleccione un mes</option>
                    {Array.from(new Set(data.map(item => item.mes))).map(mes => (
                        <option key={mes} value={mes}>{mes}</option>
                    ))}
                </select>
            </div>
            <button onClick={handleSubmit}>Enviar</button>
            {details && (
                <div>
                    <h3>Detalles:</h3>
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(details[0]).map(key => (
                                    <th key={key}>{key}</th>
                                ))}
                                <th>Accion</th>
                            </tr>
                            
                        </thead>
                        <tbody>
                            {details.map((detail, index) => (
                                <tr key={index}>
                                    {Object.values(detail).map((value, idx) => (
                                        <td key={idx}>{value}</td>
                                    ))}
                                    <td>
                                        <button className='btnEditar'><Link to={`/updateRegLibro/${detail.Id}`}>Editar</Link></button>
                                        <button onClick={() => handleDelete(detail.Id)} className='btnEliminar'><Link to={`/deleteRegLibro/${detail.Id}`}>Eliminar</Link></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DropdownSelection;
