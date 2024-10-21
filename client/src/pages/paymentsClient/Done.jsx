import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h2 className="text-4xl font-bold text-[#063255] mb-4">Gracias</h2>
      <p className="text-lg text-center mb-6">En el transcurso del día podrás descargar el recibo de pago desde <Link className="text-blue-600 hover:underline" to="/downloadRecibo">aquí</Link>.</p>
      <button
        onClick={handleBackToHome}
        className="bg-white border border-[#063255] text-[#063255] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default SuccessPage;
