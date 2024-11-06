import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

const CreateDatoLibro = () => {
    axios.defaults.withCredentials = true;
    const { lid } = useParams();
    const [colegioId, setColegioId] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [cedula, setCedula] = useState(''); 
    const [criterioBusqueda, setCriterioBusqueda] = useState('cedula');
    const [cliente, setCliente] = useState(null);
    const [fechaAtendido, setFechaAtendido] = useState('');
    const [diagnosticos, setDiagnosticos] = useState([]);
    const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState('');

    const [tratamiento, setTratamiento] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [uid, setUid] = useState(null);
    const [mesLibro, setMesLibro] = useState('');
     
    const [date, setDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [minDate, setMinDate] = useState('');
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
        const today = new Date();
        const date1 = today.toISOString().split('T')[0];
        setDate(date1);
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8081/getDiagnosticos')
            .then(response => {
                setDiagnosticos(response.data);
            })
            .catch(error => {
                console.error("Hubo un error al obtener los diagnosticos:", error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8081/getColegioIdLibro/' + lid)
            .then(res => {
                if (Array.isArray(res.data)) {
                    setColegioId(res.data[0].colegioFK2);
                    setMesLibro(res.data[0].mes);
                    const maxDateValue = calculateMaxDate(res.data[0].mes);
                    const minDateValue = calculateMinDate(res.data[0].mes);
                    setMaxDate(maxDateValue);
                    setMinDate(minDateValue);

                    const today = new Date();
                    const selectedMonth = new Date(today.getFullYear(), calculateMonth(res.data[0].mes), 1);
                    if (selectedMonth.getMonth() === today.getMonth() && selectedMonth.getFullYear() === today.getFullYear()) {
                        setFechaAtendido(today.toISOString().split('T')[0]);
                        setMaxDate(today.toISOString().split('T')[0]); // Limitar la fecha máxima a hoy
                    }
                } else {
                    alert("Error al cargar los datos");
                }
            })
            .catch(err => alert(err));
    }, [colegioId]);

    const calculateMonth = (mes) => {
        const monthMap = {
            'enero': 0,
            'febrero': 1,
            'marzo': 2,
            'abril': 3,
            'mayo': 4,
            'junio': 5,
            'julio': 6,
            'agosto': 7,
            'septiembre': 8,
            'octubre': 9,
            'noviembre': 10,
            'diciembre': 11
        };
        return monthMap[mes.toLowerCase()];
    };

    const calculateMaxDate = (mes) => {
        const today = new Date();
        const selectedMonth = calculateMonth(mes);
        const lastDayOfMonth = new Date(today.getFullYear(), selectedMonth + 1, 0).getDate();
        return new Date(today.getFullYear(), selectedMonth, lastDayOfMonth).toISOString().split('T')[0];
    };

    const calculateMinDate = (mes) => {
        const selectedMonth = calculateMonth(mes);
        return new Date(new Date().getFullYear(), selectedMonth, 1).toISOString().split('T')[0];
    };

    const handleSearch = async () => {
        try {
            const params = {
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                cedula,
                colegioId,
            };

            if (criterioBusqueda === 'nombre') {
                delete params.cedula;
            } else {
                delete params.nombre;
                delete params.apellidoPaterno;
                delete params.apellidoMaterno;
            }

            const response = await axios.get('http://localhost:8081/searchClienteLibro', {
                params: params
            });
            setCliente(response.data[0] || null);
            setError(response.data[0] ? '' : 'No se encontró el cliente');
        } catch (err) {
            setError('Error buscando el cliente');
            setCliente(null);
        }
    };

    const validateFields = () => {
        const errors = {};
        if (criterioBusqueda === 'nombre') {
            if (!nombre) errors.nombre = true;
            if (!apellidoPaterno) errors.apellidoPaterno = true;
            if (!apellidoMaterno) errors.apellidoMaterno = true;
        }
        if (criterioBusqueda === 'cedula' && !cedula) {
            errors.cedula = true;
        }
        if (!fechaAtendido) errors.fechaAtendido = true;
        if (!diagnosticos) errors.diagnostico = true;
        if (!tratamiento) errors.tratamiento = true;
        if (!observaciones) errors.observaciones = true;
    
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAgregarRegistro = async () => {
        if (!validateFields()) {
            setError('Por favor, completa todos los campos requeridos.');
            return; // No procede si hay campos vacíos
        }

        try {
            const token = Cookies.get('token');
            const response = await axios.post('http://localhost:8081/createRegistro/' + lid, {
                fechaAtendido,
                diagnostico:diagnosticoSeleccionado,
                tratamiento,
                observaciones,
                cidFK2: cliente.cid,
                uidFK3: uid,
                lidFK1: lid
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMensaje('Registro agregado correctamente');
            navigate('/libros');
        } catch (err) {
            setMensaje('Error al agregar el registro');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-[#063255] mb-6">Buscar Cliente y Agregar Registro</h1>
            <div className="space-y-4 mb-6">
                <select
                    value={criterioBusqueda}
                    onChange={(e) => setCriterioBusqueda(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]"
                >
                    <option value="nombre">Nombre Completo</option>
                    <option value="cedula">Carnet de Identidad</option>
                </select>

                {criterioBusqueda === 'nombre' && (
                    <>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className={`w-full p-3 border ${fieldErrors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]`}
                        />
                        <input
                            type="text"
                            placeholder="Apellido Paterno"
                            value={apellidoPaterno}
                            onChange={(e) => setApellidoPaterno(e.target.value)}
                            className={`w-full p-3 border ${fieldErrors.apellidoPaterno ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]`}
                        />
                        <input
                            type="text"
                            placeholder="Apellido Materno"
                            value={apellidoMaterno}
                            onChange={(e) => setApellidoMaterno(e.target.value)}
                            className={`w-full p-3 border ${fieldErrors.apellidoMaterno ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]`}
                        />
                    </>
                )}

                {criterioBusqueda === 'cedula' && (
                    <input
                        type="text"
                        placeholder="Carnet de Identidad"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        className={`w-full p-3 border ${fieldErrors.cedula ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]`}
                    />
                )}

                <button
                    onClick={handleSearch}
                    className="w-full py-3 bg-[#063255] text-white font-semibold rounded-md hover:bg-[#009ab2] transition-colors"
                >
                    Buscar Cliente
                </button>
                
            </div>

            {cliente ? (
                <div className="space-y-4">
                    <h2 className='text-2xl font-bold text-[#063255] mb-4'>Agregar datos para {cliente.nombre} {cliente.apellidoPaterno} {cliente.apellidoMaterno}</h2>
                    <input
                        required
                        disabled
                        type="date"
                        value={date}
                        onChange={(e) => setFechaAtendido(e.target.value)}
                        className={`w-full p-3 border ${fieldErrors.fechaAtendido ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]`}
                    />
                    <select
                        name="diagnostico"
                        value={diagnosticoSeleccionado}
                        onChange={(e) => setDiagnosticoSeleccionado(e.target.value)}
                        className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.diagnostico ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    >
                        {diagnosticos.map(diagnosticos => (
                            <option key={diagnosticos.diagId} value={diagnosticos.nombreDiagnostico}>
                                {diagnosticos.nombreDiagnostico}
                            </option>
                        ))}
                    </select>

                    <input
                        required
                        type="text"
                        placeholder="Tratamiento"
                        value={tratamiento}
                        onChange={(e) => setTratamiento(e.target.value)}
                        className={`w-full p-3 border ${fieldErrors.tratamiento ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]`}
                    />
                    <textarea
                        required
                        placeholder="Observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        className={`w-full p-3 border ${fieldErrors.observaciones ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#009ab2]`}
                    />
                    <button
                        onClick={handleAgregarRegistro}
                        className="w-full py-3 bg-[#063255] text-white font-semibold rounded-md hover:bg-[#007a8a] transition-colors"
                    >
                        Agregar Registro
                    </button>
                    <div className='space-x-2'>
                    <Link to="/libros">
                      <button className="w-full space-x-2 py-3 bg-[#009ab2] text-white font-semibold rounded-md hover:bg-[#007a8a] transition-colors">
                        Volver atrás
                      </button>
                    </Link>
                    </div>
                    {mensaje && <p className="text-green-600">{mensaje}</p>}
                    {error && <p className="text-red-600">{error}</p>}
                </div>
            ) : (
                <p className="text-red-600">{error}</p>
            )}
        </div>
    );
};

export default CreateDatoLibro;