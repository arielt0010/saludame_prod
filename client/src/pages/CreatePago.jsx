import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ClienteYPago = () => {
  axios.defaults.withCredentials = true;
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
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
        params: { nombre, apellidos }
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
    <div>
      <h1>Buscar Cliente y Agregar Pago</h1>
      <div>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      {cliente ? (
        <div>
          <h2>Agregar Pago para {cliente.nombre} {cliente.apellidos}</h2>
          <div>
            <input
              type="text"
              maxLength={4}
              placeholder="Gestión"
              value={gestion}
              onChange={(e) => setGestion(e.target.value)}
            />
            <input
              type="date"
              placeholder="Fecha de Pago"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
            />
            <select name="formaPago" onChange={(e) => setFormaPago(e.target.value)}>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
            </select>
            <input
              type="number"
              maxLength={5}
              placeholder="Monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
            <h3>Id del usuario: {uid}</h3>
            <button onClick={handleAgregarPago}>Agregar Pago</button>
          </div>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>No se encontró el cliente</p>
      )}
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default ClienteYPago;
