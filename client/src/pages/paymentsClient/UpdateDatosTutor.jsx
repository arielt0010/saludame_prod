import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ContactForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cid } = location.state;
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fieldErrors, setFieldErrors] = useState({}); // Nuevo estado para errores de campo

  const validateFields = () => {
    const errors = {};
    if (!nombre) errors.nombre = true;
    if (!telefono) errors.telefono = true;
    setFieldErrors(errors); // Actualiza el estado de errores
    return Object.keys(errors).length === 0; // Devuelve verdadero si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      console.log('Por favor, completa todos los campos requeridos.');
      return; // No procede si hay campos vacíos
    }

    try {
      const response = await axios.post('http://localhost:8081/uploadDatosTutor', {
        nombre,
        telefono,
        cid,
      });
      console.log('Datos enviados:', response.data);
      navigate('/hecho');
    } catch (error) {
      console.error('Error enviando los datos:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-[#063255]">Datos de contacto</h2>
      <p className="mb-4">Por favor, registra tus datos de contacto para el envío del recibo de pago</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <label className="text-[#063255] font-bold">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`border p-2 flex-1 rounded-md ${fieldErrors.nombre ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Nombre"
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <label className="text-[#063255] font-bold">Nro de celular:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className={`border p-2 flex-1 rounded-md ${fieldErrors.telefono ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Nro de celular"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200"
          >
            Finalizar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
