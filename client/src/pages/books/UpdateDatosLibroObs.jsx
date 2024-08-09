import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const UpdateDatosLibroObs = () => {
    axios.defaults.withCredentials = true;

    // Obtener el ID de los parámetros de la URL
    const { lid } = useParams();
    console.log(lid)

    const [values, setValues] = useState({
        fechaAtendido: '',
        diagnostico: '',
        tratamiento: '',
        observaciones: ''
    });

    useEffect(() => {
        if (lid) {
            axios.get(`http://localhost:8081/libroOne/${lid}`)
                .then(res => {
                    if (res.data.length > 0) {
                        const { fechaAtendido, diagnostico, tratamiento, observaciones } = res.data[0];
                        setValues({ fechaAtendido, diagnostico, tratamiento, observaciones });
                    } else {
                        console.log('No se encontraron datos para el ID:', lid);
                    }
                })
                .catch(err => console.log(err));
        } else {
            console.log('lid es undefined');
        }
    }, [lid]);

    const handleChange = e => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const navigate = useNavigate();

    const handleUpdate = e => {
        e.preventDefault();
        axios.put(`http://localhost:8081/updateRegLibro/${lid}`, values)
            .then(res => {
                if (res.data.Status === "Success") {
                    window.location.reload();
                    navigate("/libros");
                } else {
                    console.log(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            Actualizar registro
            <form>
                <input
                    type="date"
                    name="fechaAtendido"
                    placeholder="fechaAtendido"
                    onChange={handleChange}
                    value={values.fechaAtendido}
                />
                <input
                    type="text"
                    name="diagnostico"
                    placeholder="diagnostico"
                    onChange={handleChange}
                    value={values.diagnostico}
                />
                <input
                    type="text"
                    name="tratamiento"
                    placeholder="tratamiento"
                    onChange={handleChange}
                    value={values.tratamiento}
                />
                <input
                    type="text"
                    name="observaciones"
                    placeholder="observaciones"
                    onChange={handleChange}
                    value={values.observaciones}
                />
            </form>
            <button onClick={handleUpdate} className="btnRegister">Actualizar</button>
            <button className="btnBack">
                <Link to="/libros">Volver atras</Link>
            </button>
        </div>
    );
};

export default UpdateDatosLibroObs;
