import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


const CreateDatoLibro = () => {
    axios.defaults.withCredentials = true;
    const {lid} = useParams();
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [cliente, setCliente] = useState(null);
    const [fechaAtendido, setFechaAtendido] = useState('');
    const [diagnostico, setDiagnostico] = useState('');
    const [tratamiento, setTratamiento] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [uid, setUid] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            setUid(decodedToken.uid);
          } catch (err) {
            console.error('Invalid token');
          }
        }
      }, []);
    
    const handleSearch = async () => {
      try {
        const response = await axios.get('http://localhost:8081/searchCliente', {
          params: { nombre, apellidoPaterno, apellidoMaterno }
        });
        setCliente(response.data[0] || null);
        setError(response.data[0] ? '' : 'No se encontró el cliente');
      } catch (err) {
        setError('Error buscando el cliente');
        setCliente(null);
      }
    };
    
    const handleAgregarRegistro = async () => {
      try {
        const token = Cookies.get('token'); // Obtén el token desde las cookies
        const response = await axios.post('http://localhost:8081/createRegistro/' + lid , {
          fechaAtendido,
          diagnostico,
          tratamiento,
          observaciones,
          cidFK2: cliente.cid,
          uidFK3:uid,
          lidFK1: lid
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMensaje('Registro agregado correctamente');
        navigate('/libros');      
      } catch (err) {
        setMensaje('Error al agregar el registro');
      }
    };


    return (
<div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
  <h1 className="text-2xl font-bold text-[#063255] mb-6">Buscar Cliente y Agregar Registro</h1>
  <div className="space-y-4 mb-6">
    <input
      type="text"
      placeholder="Nombre"
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]"
    />
    <input
      type="text"
      placeholder="Apellido Paterno"
      value={apellidoPaterno}
      onChange={(e) => setApellidoPaterno(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]"
    />
    <input
      type="text"
      placeholder="Apellido Materno"
      value={apellidoMaterno}
      onChange={(e) => setApellidoMaterno(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]"
    />
    <button
      onClick={handleSearch}
      className="w-full py-3 bg-[#063255] text-white font-semibold rounded-md hover:bg-[#009ab2] transition-colors"
    >
      Buscar
    </button>
  </div>
  {cliente ? (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#063255] mb-4">
        Agregar Datos a {cliente.nombre} {cliente.apellidoPaterno} {cliente.apellidoMaterno}
      </h2>
      <div className="space-y-4">
        <input
          type="date"
          placeholder="Fecha de Atención"
          value={fechaAtendido}
          onChange={(e) => setFechaAtendido(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]"
        />
        <input
          type="text"
          placeholder="Diagnostico"
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]"
        />
        <input
          type="text"
          placeholder="Tratamiento"
          value={tratamiento}
          onChange={(e) => setTratamiento(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]"
        />
        <input
          type="text"
          placeholder="Observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]"
        />
        <button
          onClick={handleAgregarRegistro}
          className="w-full py-3 bg-[#063255] text-white font-semibold rounded-md hover:bg-[#009ab2] transition-colors"
        >
          Agregar Datos
        </button>
      </div>
    </div>
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : (
    <p>No se encontró el cliente</p>
  )}
  {mensaje && <p className="text-green-500">{mensaje}</p>}
</div>

  )
}

export default CreateDatoLibro