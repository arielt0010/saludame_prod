import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const Navbar = ({ toggleSidebar, isSidebarVisible, title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState('')

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    axios.get('http://localhost:8081/logout')
    .then(res => {
      navigate('/')
    }).catch(err => console.log(err))
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setName(decodedToken.name);
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  return (
    <nav className={`bg-gray-800 text-white p-4 flex justify-between items-center transition-all duration-300 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
      <div className="flex items-center">
        <FaBars onClick={toggleSidebar} className="cursor-pointer text-2xl mr-4" />
        <h1 className="text-xl">{title}</h1>
      </div>
      <div className="relative">
        <FaUserCircle onClick={handleMenuToggle} className="text-2xl cursor-pointer" />
        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-gray-700 text-white rounded shadow-lg w-48">
            <button 
              onClick={() => console.log('Mostrar algo temporal')}
              className="w-full px-4 py-2 text-left hover:bg-gray-600"
            >
              {name}
            </button>
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left hover:bg-gray-600"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
