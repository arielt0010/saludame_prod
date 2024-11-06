import React, { useEffect, useState } from 'react'
import {FaHome} from 'react-icons/fa'
import { FaUsers, FaBookMedical} from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode'

const Sidebar = ({sidebarToggle}) => {
    const [auth, setAuth] = useState(false)
    const [ridFK, setRidFK] = useState(null)
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
          setAuth(true);  
          try {
            const decodedToken = jwtDecode(token);
            setRidFK(decodedToken.ridFK);
          } catch (err) {
            console.error('Invalid token');
          }
        }
      }, []);

    const renderItems = () => {
      switch (ridFK) {
        case 3:
          return (
            <>
              <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a href="/libros">
                  <FaBookMedical className='inline-block w-6 h-6 mr-2 -mt-2' />
                  Libro de consultas médicas
                </a>
              </li>
            </>
          );
        case 4:
          return (
            <>
              <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2 '>
                <a href="/libros">
                  <FaBookMedical className='inline-block w-6 h-6 mr-2 -mt-2' />
                  Libro de consultas médicas
                </a>
              </li>
              <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a href="/pagos">
                  <MdPayments className='inline-block w-6 h-6 mr-2 -mt-2' />
                  Pagos
                </a>
              </li>
            </>);
        case 1:
          return (
            <>
              <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a href="/users">
                  <FaUsers className='inline-block w-6 h-6 mr-2 -mt-2' />
                  Usuarios
                </a>
              </li>
              <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a href="/libros">
                  <FaBookMedical className='inline-block w-6 h-6 mr-2 -mt-2' />
                  Libro de consultas médicas
                </a>
              </li>
              <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a href="/pagos">
                  <MdPayments className='inline-block w-6 h-6 mr-2 -mt-2' />
                  Pagos
                </a>
              </li>
            </>);
            default:
              return <li>No tienes acceso a ningún módulo</li>; 
          }     
    }
    return (
        <div className={`fixed top-0 left-0 h-full bg-gray-800 px-4 py-2 transition-transform duration-300 ${sidebarToggle ? '-translate-x-full' : 'translate-x-0'} w-64`}>
        <div className='my-2 mb-4'>
          <h1 className='text-white text-2xl font-bold'>SaludAME</h1>
        </div>
        {auth ? (
          <div>
            <hr />
            <ul className='mt-3 text-white font-bold'>
              <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a href="/start">
                  <FaHome className='inline-block w-6 h-6 mr-2 -mt-2' />
                  Inicio
                </a>
              </li>
              {renderItems()}
            </ul>
          </div>
        ) : (
          <div>
            <hr />
            <ul className='mt-3 text-white font-bold'>
              <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a href="/">
                  <FaHome className='inline-block w-6 h-6 mr-2 -mt-2' />
                  Inicio
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
)}

export default Sidebar