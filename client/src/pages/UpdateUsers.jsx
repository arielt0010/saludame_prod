import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const UpdateUsers = () => {
    axios.defaults.withCredentials = true;

    //handle getting id
    const {id} = useParams();

    useEffect(() => {
        axios.get('http://localhost:8081/users/' + id)
        .then(res => {
           setValues({...values, name: res.data[0].nombre, user: res.data[0].usuario, rid_fk : res.data[0].rid_fk})
        }).catch(err =>console.log(err))
    }, [id])

    //handle update
    const [values, setValues] = useState({
        name : '',
        user: '',
        rid_fk: '',
        password: ''
      })
      const handleChange = e => {
        setValues(prev=>({...prev, [e.target.name]: e.target.value}))
      }
      const navigate = useNavigate()
      const handleUpdate = e => {
        e.preventDefault();
        axios.put('http://localhost:8081/update/' +id, values)
        .then(res => {
          if(res.data.Status === "Success"){
            window.location.reload()
            navigate("/libros")
          }else{
            console.log(res.data.Error)
          }
        })
        .then(err => console.log(err));
      }    
    return (
    <div className="auth">
    <h1 className="login"> Actualizar usuario
      <form action="">
        <input required type="text" placeholder="nombre" name="name" id="" onChange={handleChange} value= {values.name}/>
        <input requiredtype="text" placeholder="username" name="user" id=""onChange={handleChange} value = {values.user} />
        <input type="password" placeholder="change password? leave blank if not" name="password" id="" onChange={handleChange}/>
        <select name="rid_fk" onChange={handleChange} value={values.rid_fk}> 
          <option value="">Seleccione Rol</option>
          <option value="1">Administrador</option>
          <option value="2">Gerente</option>
          <option value="3">Medico</option>
          <option value="4">Secretaria</option>
    </select>
        <button onClick={handleUpdate} className='btnRegister'>Actualizar</button>
        <button className="btnBack"><Link to="/users">Volver atras</Link></button>
      </form>
    </h1>
  </div>
  )
}

export default UpdateUsers