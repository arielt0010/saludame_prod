import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode';

const HomeSistema = () => {
  axios.defaults.withCredentials = true;
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [rid_fk, setRid_fk] = useState(null)

  const handleDelete =() => {
    axios.get('http://localhost:8081/logout')
    .then(res => {
      window.location.reload(true);
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
        setRid_fk(decodedToken.rid_fk);
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  return (
    <div>
      {
        auth ?
        <div>
          <h3> Hello, {name} con el rol {rid_fk}</h3>
          {rid_fk === 1 && (
            <button>Administrar Usuarios</button>
          )}
          {rid_fk === 3 && (
            <button>Administrar libro de observaciones</button>
          )}
          {rid_fk === 4 && (
            <button>Administrar pagos</button>
          )}
          <button className='logout' onClick={handleDelete}>Log out</button>
        </div>
        :
        <div>
          <h3>{message}</h3>
          <h3>You are not authorized.</h3>
          <Link to='/login'>Login here.</Link>
        </div>
      }

    </div>
  )
}
export default HomeSistema;