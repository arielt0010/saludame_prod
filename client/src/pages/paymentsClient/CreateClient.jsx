import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const AddClientForm = () => {
    const [uid, setUid] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        ci: '',
        fechaNacimiento: '',
        colegio: '',
        curso: '',
        uidFK1: ''  
    });
    const [colegios, setColegios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUid(decodedToken.uid);
            } catch (err) {
                console.error('Invalid token');
            }
        }
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8081/getColegios')
            .then(response => {
                setColegios(response.data);
                setFormData(prevData => ({
                    ...prevData,
                    colegio: response.data[0]?.cid || ''
                }));
            })
            .catch(error => {
                console.error("Hubo un error al obtener los colegios:", error);
            });
    }, []);

    useEffect(() => {
        if (uid !== null) {
            setFormData(prevData => ({
                ...prevData,
                uidFK1: uid
            }));
        }
    }, [uid]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await axios.post('http://localhost:8081/createClient', formData);
            console.log(response);
            if (uid !== null) {
                navigate('/createPayment');
            } else {
                navigate('/seguro');
            }
        } catch (error) {
            console.error("Hubo un error al enviar los datos:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white rounded-md shadow-md">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Apellido Paterno:</label>
                <input
                    type="text"
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Apellido Materno:</label>
                <input
                    type="text"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">CI:</label>
                <input
                    type="text"
                    name="ci"
                    value={formData.ci}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento:</label>
                <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Colegio:</label>
                <select
                    name="colegio"
                    value={formData.colegio}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                    {colegios.map(colegio => (
                        <option key={colegio.cid} value={colegio.cid}>
                            {colegio.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Curso:</label>
                <input
                    type="text"
                    name="curso"
                    value={formData.curso}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
            </div>

            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mb-4"
            >
                Agregar
            </button>
            <Link to="/seguro">
                <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 w-full"
                >
                    Volver atrás
                </button>
            </Link>
        </form>
    );
};

export default AddClientForm;
