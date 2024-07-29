import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

const UpdateDatosLibroObs = () => {
    axios.defaults.withCredentials = true;

    //handle getting id
    const {lid} = useParams();

    useEffect(() => {
        axios.get('http://localhost:8081/libroOne/' + lid)
        .then(res => {
            console.log(res.data)
           setValues({...values, fechaAtendido: res.data[0].fechaAtendido, diagnostico: res.data[0].diagnostico, tratamiento : res.data[0].tratamiento, observaciones : res.data[0].observaciones})
        }).catch(err =>console.log(err))
    }, [lid])
  
    //handle update
        const [values, setValues] = useState({
        fechaAtendido : '',
        diagnostico: '',
        tratamiento: '',
        observaciones: ''
      })
      const handleChange = e => {
        setValues(prev=>({...prev, [e.target.name]: e.target.value}))
      }
      const navigate = useNavigate()
      const handleUpdate = e => {
        e.preventDefault();
        axios.put('http://localhost:8081/updateRegLibro/' +lid, values)
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
    <div> Actualizar registro
        <form action="">
            <input type="date" name="fechaAtendido" id="" placeholder='fechaAtendido' onChange={handleChange} value = {values.fechaAtendido} />
            <input type="text" name="diagnostico" id="" placeholder='diagnostico' onChange={handleChange} value={values.diagnostico} />
            <input type="text" name="tratamiento" id="" placeholder='tratamiento' onChange={handleChange} value={values.tratamiento} />
            <input type="text" name="observaciones" id="" placeholder='observaciones' onChange={handleChange} value={values.observaciones} />
        </form>
            <button onClick={handleUpdate} className='btnRegister'>Actualizar</button>
            <button className="btnBack"><Link to="/libros">Volver atras</Link></button>
    </div>
  )
}

export default UpdateDatosLibroObs