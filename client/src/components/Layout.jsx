import React, { useState } from 'react';
import { Outlet, useLocation, matchPath } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const location = useLocation();
  const showNavbarAndSidebar = !['/login', '/' ].includes(location.pathname);

  // Mapa de rutas a títulos, incluyendo rutas con parámetros
  const routeTitles = {
    '/start': 'Inicio',
    '/seguro': 'Seguro',
    '/users': 'Usuarios',
    '/updateUser': 'Actualizar Usuario',
    '/updateRegLibro': 'Actualizar Libro',
    '/libros': 'Libro de Observaciones',
    '/pagos': 'Pagos realizados',
    '/createPayment': 'Agregar Pago',
    '/createRegistro': 'Agregar Registro',
    '/createClient': 'Agregar Cliente',
    '/create-user': 'Crear Usuario',
    '/login': 'Iniciar Sesión',
  };

  const getTitle = (pathname) => {
    for (const route in routeTitles) {
      if (matchPath(route, pathname)) {
        console.log(routeTitles[route]);
        return routeTitles[route];
      }
    }
    return 'Título';
  };

  const currentTitle = getTitle(location.pathname);

  return (
    <div className="flex h-screen flex-col">
      {showNavbarAndSidebar && <Navbar toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} title={currentTitle} />}
      <div className={`flex flex-1 transition-all duration-300 ${isSidebarVisible ? 'ml-64' : ''}`}>
        <Sidebar sidebarToggle={!isSidebarVisible} /> 
        <div className={`flex-1 p-4`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
