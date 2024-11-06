import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AddClientForm = () => {
    const [uid, setUid] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        ci: '',
        fechaNacimiento: '',
        colegio: '',
        uidFK1: 26,
        sexo: '',
        tipoDeSangre: '',
        alergias: '',
        enfermedadesBase: ''  
    });
    const [colegios, setColegios] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({}); // Nuevo estado para errores de campo
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
        document.title = "Agregar Asegurado";
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

    const validateFields = () => {
        const errors = {};
        // Verificar campos requeridos
        for (const key in formData) {
            if (!formData[key] ) {
                errors[key] = true;
            }
        }
        setFieldErrors(errors); // Actualiza el estado de errores
        return Object.keys(errors).length === 0; // Devuelve verdadero si no hay errores
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) {
            alert("Por favor, completa todos los campos requeridos.");
            return; // No procede si hay campos vacíos
        }

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
                <h1 className='text-3xl font-bold text-center text-[#063255] mb-3'>Agregar Asegurado</h1>
                <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Apellido Paterno:</label>
                <input
                    type="text"
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.apellidoPaterno ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Apellido Materno:</label>
                <input
                    type="text"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.apellidoMaterno ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Cédula de identidad:</label>
                <input
                    type="text"
                    name="ci"
                    value={formData.ci}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.ci ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento:</label>
                <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Sexo:</label>
                <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.sexo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    
                >
                <option value="">Seleccione sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tipo de Sangre:</label>
                <select
                    name="tipoDeSangre"
                    value={formData.tipoDeSangre}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.tipoDeSangre ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    
                >
                <option value="">Seleccione tipo de sangre</option>
                <option value="A RH+">A RH+</option>
                <option value="A RH-">A RH-</option>
                <option value="B RH+">B RH-</option>
                <option value="B RH-">B RH-</option>
                <option value="AB RH+">AB RH-</option>
                <option value="AB RH-">AB RH-</option>
                <option value="O RH+">O RH+</option>
                <option value="O RH-">O RH-</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Alergias:</label>
                <textarea
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.alergias ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Enfermedades base:</label>
                <textarea
                    name="enfermedadesBase"
                    value={formData.enfermedadesBase}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.enfermedadesBase ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Colegio:</label>
                <select
                    name="colegio"
                    value={formData.colegio}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.colegio ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    
                >
                    {colegios.map(colegio => (
                        <option key={colegio.cid} value={colegio.cid}>
                            {colegio.nombre}
                        </option>
                    ))}
                </select>
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
