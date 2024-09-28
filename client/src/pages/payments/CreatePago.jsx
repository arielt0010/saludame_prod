import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

const ClienteYPago = () => {
  axios.defaults.withCredentials = true;
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [cedula, setCedula] = useState('');
  const [criterioBusqueda, setCriterioBusqueda] = useState('nombre');
  const [cliente, setCliente] = useState(null);
  const [gestion, setGestion] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [formaPago, setFormaPago] = useState('');
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [uid, setUid] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); // Nuevo estado para errores de campo
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
      const params = {};
      if (criterioBusqueda === 'nombre') {
        params.nombre = nombre;
        params.apellidoPaterno = apellidoPaterno;
        params.apellidoMaterno = apellidoMaterno;
      } else {
        params.cedula = cedula;
      }

      const response = await axios.get('http://localhost:8081/searchCliente', {
        params: params,
      });
      setCliente(response.data[0] || null);
      setError(response.data[0] ? '' : 'No se encontró el cliente');
    } catch (err) {
      setError('Error buscando el cliente');
      setCliente(null);
    }
  };

  const validateFields = () => {
    const errors = {};
    if (criterioBusqueda === 'nombre') {
      if (!nombre) errors.nombre = true;
      if (!apellidoPaterno) errors.apellidoPaterno = true;
      if (!apellidoMaterno) errors.apellidoMaterno = true;
    } else {
      if (!cedula) errors.cedula = true;
    }
    if (!gestion) errors.gestion = true;
    if (!fechaPago) errors.fechaPago = true;
    if (!formaPago) errors.formaPago = true;
    if (!monto) errors.monto = true;

    setFieldErrors(errors); // Actualiza el estado de errores
    return Object.keys(errors).length === 0; // Devuelve verdadero si no hay errores
  };

  const handleAgregarPago = async () => {
    if (!validateFields()) {
      setError('Por favor, completa todos los campos requeridos.');
      return; // No procede si hay campos vacíos
    }

    try {
      const token = Cookies.get('token');
      const response = await axios.post('http://localhost:8081/createPayment', {
        gestion,
        fechaPago,
        formaPago,
        monto,
        cid_fk: cliente.cid,
        uid_fk2: uid,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMensaje('Pago agregado correctamente');
      navigate('/pagos');
    } catch (err) {
      setMensaje('Error al agregar el pago. Inténtelo de nuevo');
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-[#ffffff] p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#063255] mb-6">Buscar Cliente y Agregar Pago</h1>
        
        <select
          value={criterioBusqueda}
          onChange={(e) => setCriterioBusqueda(e.target.value)}
          className="mb-4 p-2 border rounded-md w-full"
        >
          <option value="nombre">Nombre Completo</option>
          <option value="cedula">Cédula</option>
        </select>

        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          {criterioBusqueda === 'nombre' && (
            <>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`mb-2 sm:mb-0 p-2 border ${fieldErrors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md w-full sm:w-1/3`}
                required
              />
              <input
                type="text"
                placeholder="Apellido Paterno"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
                className={`mb-2 sm:mb-0 p-2 border ${fieldErrors.apellidoPaterno ? 'border-red-500' : 'border-gray-300'} rounded-md w-full sm:w-1/3`}
                required
              />
              <input
                type="text"
                placeholder="Apellido Materno"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
                className={`mb-2 sm:mb-0 p-2 border ${fieldErrors.apellidoMaterno ? 'border-red-500' : 'border-gray-300'} rounded-md w-full sm:w-1/3`}
                required
              />
            </>
          )}

          {criterioBusqueda === 'cedula' && (
            <input
              type="text"
              placeholder="Cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className={`mb-2 sm:mb-0 p-2 border ${fieldErrors.cedula ? 'border-red-500' : 'border-gray-300'} rounded-md w-full`}
              required
            />
          )}

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
                className={`mb-2 sm:mb-0 p-2 border ${fieldErrors.gestion ? 'border-red-500' : 'border-gray-300'} rounded-md w-full sm:w-1/4`}
                required
              />
              <input
                type="date"
                placeholder="Fecha de Pago"
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
                className={`mb-2 sm:mb-0 p-2 border ${fieldErrors.fechaPago ? 'border-red-500' : 'border-gray-300'} rounded-md w-full sm:w-1/4`}
                required
              />
              <select
                name="formaPago"
                onChange={(e) => setFormaPago(e.target.value)}
                className={`mb-2 sm:mb-0 p-2 border ${fieldErrors.formaPago ? 'border-red-500' : 'border-gray-300'} rounded-md w-full sm:w-1/4`}
                required
              >
                <option value="">Selecciona forma de pago</option>
                <option value="1">Efectivo</option>
                <option value="2">Transferencia</option>
              </select>
              <input
                type="number"
                maxLength={5}
                placeholder="Monto"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className={`mb-2 sm:mb-0 p-2 border ${fieldErrors.monto ? 'border-red-500' : 'border-gray-300'} rounded-md w-full sm:w-1/4`}
                required
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
            <p>¿Es estudiante nuevo? 
              <Link to="/createClient"> Agregar cliente</Link>
            </p>
          </div>
        ) : (
          <div />
        )}
        {mensaje && <p className="text-red-500">{mensaje}</p>}
      </div>
    </div>
  );
};

export default ClienteYPago;
