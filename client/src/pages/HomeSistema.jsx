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

  const handleDelete =() => {
    axios.get('http://localhost:8081/logout')
    .then(res => {
      navigate('/')
    }).catch(err => console.log(err))
  }

  useEffect(()=> {
    axios.get('http://localhost:8081/start')
    .then(res => {
      if(res.data.Status === "Success"){
        setAuth(true);
        setName(res.data.name)        
        console.log(res.data.name)
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      {auth ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Hello, {name} con el rol {ridFK}</h3>
          {ridFK === 1 && <Administrador />}
          {ridFK === 3 && <Medico/>}
          {ridFK === 4 && <Secretaria />}
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-red-500">{message}</h3>
          <h3 className="text-md mb-4">You are not authorized.</h3>
          <div className="space-y-2">
            <Link to="/login">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 w-full">
                Login here
              </button>
            </Link>
            <Link to="/">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 w-full">
                Back to home
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  </div>
  )
}
export default HomeSistema;