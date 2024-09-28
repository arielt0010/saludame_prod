import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode';
import Administrador from '../pages/homepages/Administrador';
import Medico from '../pages/homepages/Medico';
import Secretaria from '../pages/homepages/Secretaria';


const HomeSistema = () => {
  axios.defaults.withCredentials = true;
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [ridFK, setRidFK] = useState(null)
  const navigate = useNavigate();

  useEffect(()=> {
    axios.get('http://localhost:8081/start')
    .then(res => {
      if(res.data.Status === "Success"){
        setAuth(true);
        setName(res.data.name)        
      }else{
        setAuth(false)
        setMessage(res.data.Error)
      }
    })
    .then(err => console.log(err))
  })

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRidFK(decodedToken.ridFK);
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  return (
    <div>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      {auth ? (
        <div>
          <h1 className="text-xl font-semibold mb-4">Hola, {name} </h1>
          {ridFK === 1 && <Administrador />}
          {ridFK === 2 && <Administrador />}
          {ridFK === 3 && <Medico />}
          {ridFK === 4 && <Secretaria />}
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-red-500">{message}</h3>
          <h3 className="text-md spacemb-4">No tienes permisos para acceder a esta página.</h3>
          <div className="space-y-2 mt-4">
            <Link to="/login">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 w-full">
                Iniciar sesión
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  </div>
  </div>
  )
}
export default HomeSistema;