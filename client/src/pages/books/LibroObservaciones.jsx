import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'

const DropdownSelection = () => {
    axios.defaults.withCredentials = true;
    const [data, setData] = useState([]);
    const [nombre, setNombre] = useState('');
    const [gestion, setGestion] = useState('');
    const [mes, setMes] = useState('');
    const [lid, setLid] = useState(null);   
    const [details, setDetails] = useState(null);   //detalles del libro de observaciones

    useEffect(() => {
        // Obtener los datos del backend
        axios.get('http://localhost:8081/libros')
            .then(response => {
                console.log(response.data)
                setData(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }, []);

    const handleSubmit = async () => {
        try{
            const res = await axios.get(`http://localhost:8081/libros/filter?colegio=${nombre}&gestion=${gestion}&mes=${mes}`);
            const lid = res.data.lid;
            setLid(lid);
            const observacionesResponse = await axios.get(`http://localhost:8081/libros/${lid}`);
            setDetails(observacionesResponse.data);
        }catch(err){
            alert(err)
        }
    }

    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-[#ffffff] flex flex-col items-center p-6">
        <div className="w-full max-w-2x1 bg-[#ffffff] p-6 rounded-lg shadow-lg">
          <div className="flex flex-wrap justify-between items-center mb-4 space-y-2">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="text-[#063255] font-bold">Colegio:</label>
              <select
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="">Seleccione un colegio</option>
                {Array.from(new Set(data.map(item => item.nombre))).map(nombre => (
                  <option key={nombre} value={nombre}>{nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="text-[#063255] font-bold">Gestión:</label>
              <select
                value={gestion}
                onChange={(e) => setGestion(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="">Seleccione una gestión</option>
                {Array.from(new Set(data.map(item => item.gestion))).map(gestion => (
                  <option key={gestion} value={gestion}>{gestion}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="text-[#063255] font-bold">Mes:</label>
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="">Seleccione un mes</option>
                {Array.from(new Set(data.map(item => item.mes))).map(mes => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200"
            >
              Enviar
            </button>
          </div>
          {details && (
            <div className="mt-6">
              <div className="overflow-x-auto">
              <div className="flex justify-end mb-4">
                <Link to={`/createRegistro/${lid}`}>
                  <button className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200">
                    Crear registro
                  </button>
                </Link>
              </div>
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-[#063255] text-white">
                      {Object.keys(details[0]).map(key => (
                        <th key={key} className="px-4 py-2 border">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((detail, index) => (
                      <tr key={index} className="even:bg-gray-100">
                        {Object.values(detail).map((value, idx) => (
                          <td key={idx} className="px-4 py-2 border">{value}</td>
                        ))}
                        <td className="px-4 py-2 border flex space-x-2">

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default DropdownSelection;
