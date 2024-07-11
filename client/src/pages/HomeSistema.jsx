import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const HomeSistema = () => {
  axios.defaults.withCredentials = true;
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')

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
        setName(res.data.usuario)
      }else{
        setAuth(false)
        setMessage(res.data.Error)
      }
    })
    .then(err => console.log(err))
  })
  return (
    <div>
      {
        auth ?
        <div>
          <h3> Hello, {name}</h3>
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
export default HomeSistema