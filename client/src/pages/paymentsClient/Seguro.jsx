import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Seguro = () => {
  axios.defaults.withCredentials = true;
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [cedula, setCedula] = useState(''); // Nuevo estado para cédula
  const [criterioBusqueda, setCriterioBusqueda] = useState('nombre'); // Nuevo estado para criterio
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Para manejar el mensaje de deudas pendientes
  
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const params = {};

      // Usar el criterio de búsqueda seleccionado
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
      const foundCliente = response.data[0] || null;
      setCliente(foundCliente);
      setError(foundCliente ? '' : 'No se encontró el cliente');

      if (foundCliente) {
        const paymentResponse = await axios.get(`http://localhost:8081/check-payment-status/${foundCliente.cid}`);
        if (paymentResponse.status === 204) {
          setMessage(paymentResponse.data.message);
        } else if (paymentResponse.status === 200) {
          navigate("/subirPagos", {state: {cid: foundCliente.cid}});
        }
      }
    } catch (err) {
      setError('Error buscando el cliente');
      setCliente(null);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Paga tu seguro</h1>
      <h2 className="text-lg mb-4 text-center text-gray-600">Escribe el nombre completo del asegurado o su carnet de identidad y presione buscar.</h2> 
      
      {/* ComboBox para seleccionar el criterio de búsqueda */}
      <select
        value={criterioBusqueda}
        onChange={(e) => setCriterioBusqueda(e.target.value)}
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="nombre">Nombre Completo</option>
        <option value="cedula">Carnet de Identidad</option>
      </select>

      {criterioBusqueda === 'nombre' && (
        <>
          <div className="mb-4">
            <input 
              type="text" 
              name="nombre"           
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#009ab2] focus:border-[#009ab2] sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <input 
              type="text" 
              name="apellidoPaterno" 
              placeholder="Apellido Paterno" 
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <input 
              type="text" 
              name="apellidoMaterno" 
              placeholder="Apellido Materno" 
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </>
      )}

      {criterioBusqueda === 'cedula' && (
        <div className="mb-4">
          <input 
            type="text" 
            name="cedula" 
            placeholder="Carnet de Identidad"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      )}

      <button 
        type="submit" 
        onClick={handleSearch}
        className="w-full px-4 py-2 bg-[#009ab2] text-white font-bold rounded-md hover:bg-[#004a6c] focus:outline-none focus:ring-[#009ab2] focus:ring-opacity-75"
      >
        Buscar asegurado
      </button>

      {cliente ? (
        <div className="mt-4">         
          <p className="mb-2 text-gray-800">{message}</p>
        </div>
      ) : error ? (
        <div className="mt-4 text-red-500">
          <p className="mb-2">{error}</p>
          <p>¿Es estudiante nuevo? 
            <Link to="/createClient" className="text-indigo-600 hover:underline"> Agregar cliente</Link>
          </p>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default Seguro;
