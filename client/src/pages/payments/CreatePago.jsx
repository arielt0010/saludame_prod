import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom'

const ClienteYPago = () => {
  axios.defaults.withCredentials = true;
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [cliente, setCliente] = useState(null);
  const [gestion, setGestion] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [formaPago, setFormaPago] = useState('');
  const [monto, setMonto] = useState('');
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

  const handleAgregarPago = async () => {
    try {
      const token = Cookies.get('token'); // Obtén el token desde las cookies
      const response = await axios.post('http://localhost:8081/createPayment', {
        gestion,
        fechaPago,
        formaPago,
        monto,
        cid_fk: cliente.cid,
        uid_fk2:uid
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMensaje('Pago agregado correctamente');
      navigate('/pagos');      
    } catch (err) {
      setMensaje('Error al agregar el pago');
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center p-6">
    <div className="w-full max-w-4xl bg-[#ffffff] p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-[#063255] mb-6">Buscar Cliente y Agregar Pago</h1>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mb-2 sm:mb-0 p-2 border rounded-md w-full sm:w-1/3"
        />
        <input
          type="text"
          placeholder="Apellido Paterno"
          value={apellidoPaterno}
          onChange={(e) => setApellidoPaterno(e.target.value)}
          className="mb-2 sm:mb-0 p-2 border rounded-md w-full sm:w-1/3"
        />
        <input
          type="text"
          placeholder="Apellido Materno"
          value={apellidoMaterno}
          onChange={(e) => setApellidoMaterno(e.target.value)}
          className="mb-2 sm:mb-0 p-2 border rounded-md w-full sm:w-1/3"
        />
        <button
          onClick={handleSearch}
          className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200 w-full sm:w-auto"
        >
          Buscar
        </button>
      </div>
      {cliente ? (
        <div>
          <h2 className="text-2xl font-bold text-[#063255] mb-4">
            Agregar Pago para {cliente.nombre} {cliente.apellidoPaterno} {cliente.apellidoMaterno}
          </h2>
          <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
            <input
              type="text"
              maxLength={4}
              placeholder="Gestión"
              value={gestion}
              onChange={(e) => setGestion(e.target.value)}
              className="mb-2 sm:mb-0 p-2 border rounded-md w-full sm:w-1/4"
            />
            <input
              type="date"
              placeholder="Fecha de Pago"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              className="mb-2 sm:mb-0 p-2 border rounded-md w-full sm:w-1/4"
            />
            <select
              name="formaPago"
              onChange={(e) => setFormaPago(e.target.value)}
              className="mb-2 sm:mb-0 p-2 border rounded-md w-full sm:w-1/4"
            >
              <option value="1">Efectivo</option>
              <option value="2">Transferencia</option>
            </select>
            <input
              type="number"
              maxLength={5}
              placeholder="Monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="mb-2 sm:mb-0 p-2 border rounded-md w-full sm:w-1/4"
            />
            <button
              onClick={handleAgregarPago}
              className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200 w-full sm:w-auto"
            >
              Agregar Pago
            </button>
          </div>
        </div>
      ) : error ? (
        <div>
        <p className="text-red-500">{error}</p>
        <p>Es estudiante nuevo? 
          <Link to="/createClient"> Agregar cliente</Link>
        </p>
        </div>
      ) : (
        <div/>
      )}
      {mensaje && <p className="text-green-500">{mensaje}</p>}
    </div>
  </div>
  );
};

export default ClienteYPago;
