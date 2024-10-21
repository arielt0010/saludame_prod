import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logoSaludAME.jpg'
import Cookies from 'js-cookie';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token'); 
    if (token) {
      navigate('/start');
    }
  }, [navigate]);

  useEffect(() => { 
    document.title = "SaludAME - Inicio";
}, []);

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6 space-y-6">
      <img src={Logo} alt="Logo de la empresa" className="w-[400px] mb-4" />
      <h1 className="text-3xl font-bold text-[#063255]">Bienvenid@.</h1>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        <Link to="/login">
          <button className="bg-[#063255] text-white px-6 py-3 rounded-md hover:bg-[#004a6c] transition-colors duration-200 w-full">
            Usuarios del sistema
          </button>
        </Link>
        <Link to="/seguro">
          <button className="bg-[#009ab2] text-white px-6 py-3 rounded-md hover:bg-[#007a8a] transition-colors duration-200 w-full">
            Pagar seguro
          </button>
        </Link>
        <Link to="/downloadRecibo">
          <button className="bg-[#00afcb] text-white px-6 py-3 rounded-md hover:bg-[#007a8a] transition-colors duration-200 w-full">
            Descargar recibo
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home