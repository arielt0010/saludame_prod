import axios from 'axios';
import React, { useEffect, useState, useRef} from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode';
import Administrador from '../pages/homepages/Administrador';
import Medico from '../pages/homepages/Medico';
import Secretaria from '../pages/homepages/Secretaria';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeSistema = () => {
  axios.defaults.withCredentials = true;
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [ridFK, setRidFK] = useState(null)
  const [users, setUsers] = useState([])
  const shownNotifications = useRef(new Set()); 

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

  //notificacion de usuarios con restablecimiento de contraseña
  useEffect(() => {
    if(ridFK===1){axios.get('http://localhost:8081/usuariosConRestablecimiento')
      .then(res => {
        if(res.status === 200){
        const usuariosRestablecer = res.data;
        setUsers(usuariosRestablecer);
        usuariosRestablecer.forEach(usuario => {
          if (!shownNotifications.current.has(usuario.usuario)) {
            toast.error(`El usuario ${usuario.usuario} ha solicitado restablecer su contraseña.`);
            shownNotifications.current.add(usuario.usuario); // Marcar como notificado
          }
        });}
        else{
          alert("Error al cargar los datos");
        }
      })
      .catch(err => alert(err))
    }
  }, [ridFK])

  //notificacion de pagos pendientes de aprobar
  useEffect(() => {
  if(ridFK===1 || ridFK===3){
    axios.get('http://localhost:8081/pagosCantidad')
      .then(res => {
        if(res.status === 200){
          const cantidadPagos = res.data[0].total -1;
          console.log(cantidadPagos);
          if (cantidadPagos > 0) {
            toast.info(`Hay ${cantidadPagos} pago(s) pendiente(s) de aprobación.`);
          }
        }
        else{
          alert("Error al cargar los datos");
        }
      })
      .catch(err => alert(err))
  }
  }, [ridFK])

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
      <ToastContainer />
  </div>
  )
}
export default HomeSistema;