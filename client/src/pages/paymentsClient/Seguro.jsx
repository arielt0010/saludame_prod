import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Seguro = () => {
  axios.defaults.withCredentials = true;
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(''); 
  const [message, setMessage] = useState(''); // Para manejar el mensaje de deudas pendientes
  const [pendingPayments, setPendingPayments] = useState([]); // Para manejar los pagos pendientes

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8081/searchCliente', {
        params: { nombre, apellidoPaterno, apellidoMaterno }
      });
      const foundCliente = response.data[0] || null;
      setCliente(foundCliente);
      setError(foundCliente ? '' : 'No se encontró el cliente');

      if (foundCliente) {
        // Si se encuentra el cliente, verificar el estado de los pagos
        const paymentResponse = await axios.get(`http://localhost:8081/check-payment-status/${foundCliente.clientId}`);
        
        if (paymentResponse.data.message) {
          setMessage(paymentResponse.data.message); // Mostrar mensaje si no hay deudas pendientes
        } else {
          setPendingPayments(paymentResponse.data.pendingPayments); // Mostrar pagos pendientes si existen
        }
      }
    } catch (err) {
      setError('Error buscando el cliente');
      setCliente(null);
    }
  };

  return (
    <div>
      <h1>Cancela tu seguro</h1>
      <h2>Escribe el nombre completo del cliente</h2>
      <input 
        type="text" 
        name="nombre"           
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input 
        type="text" 
        name="apellidoPaterno" 
        placeholder="Apellido Paterno" 
        value={apellidoPaterno}
        onChange={(e) => setApellidoPaterno(e.target.value)}
      />
      <input 
        type="text" 
        name="apellidoMaterno" 
        placeholder="Apellido Materno" 
        value={apellidoMaterno}
        onChange={(e) => setApellidoMaterno(e.target.value)}
      />
      <button type="submit" onClick={handleSearch}>
        Enviar
      </button>
      {cliente ? (
        <div>         
          {/* Mostrar mensaje o tabla dependiendo del estado de los pagos */}
          {message ? (
            <p>{message}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Gestión</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.gestion}</td>
                    <td>
                      <button onClick={() => handlePayment(payment.gestion)}>Pagar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : error ? (
        <div>
          <p className="text-red-500">{error}</p>
          <p>¿Es estudiante nuevo? 
            <Link to="/createClient"> Agregar cliente</Link>
          </p>
        </div>
      ) : (
        <div/>
      )}
    </div>
  )
}

const handlePayment = (gestion) => {
  // Aquí iría la lógica para manejar el pago
  console.log("Pago gestion:", gestion);
}

export default Seguro;
