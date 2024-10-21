import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DropdownSelection = () => {
    axios.defaults.withCredentials = true;
    
    const [ridFK, setRidFK] = useState('');
    const [uid, setUid] = useState('');
    
    const nowName = new Date().toDateString();
    console.log(nowName);
    const now = new Date();
    const monthNames = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const currentMonth = monthNames[now.getMonth()];
    
    const [data, setData] = useState([]);
    const [colegio, setColegio] = useState('Todos');
    const [gestion, setGestion] = useState('2024');
    const [mes, setMes] = useState(currentMonth);
    const [lid, setLid] = useState(null);
    const [details, setDetails] = useState([]);
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [cedula, setCedula] = useState('');
    const [searchType, setSearchType] = useState('nombre');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRidFK(decodedToken.ridFK);
                setUid(decodedToken.uid);
            } catch (err) {
                console.error('Invalid token');
            }
        }
    }, []);
    
    useEffect(() => {
        if (ridFK === 3) {
            axios.get(`http://localhost:8081/getColegioInfo/${uid}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setColegio(res.data[0].nombre);
                    } else {
                        alert("Error al cargar los datos");
                    }
                })
                .catch(err => alert(err));
        }
    }, [ridFK, uid]);

    useEffect(() => {
        axios.get('http://localhost:8081/libros')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }, []);

    const handleSubmit = async () => {
        try {
            setIsSubmitted(true); // Marcar como enviado
            const res = await axios.get(`http://localhost:8081/libros/filter?colegio=${colegio}&gestion=${gestion}&mes=${mes}`);
            const lid = res.data.lid;
            setLid(lid);
            const observacionesResponse = await axios.get(`http://localhost:8081/libros/${lid}`);
            setDetails(observacionesResponse.data);
        } catch (err) {
            alert(err);
        }
    }

    const handleFilter = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/anotherLibro/filter?lid=${lid}&nombre=${searchType === 'nombre' ? nombre : ''}&apellidoPaterno=${searchType === 'nombre' ? apellidoPaterno : ''}&apellidoMaterno=${searchType === 'nombre' ? apellidoMaterno : ''}&cedula=${searchType === 'cedula' ? cedula : ''}&page=${page}&limit=10`);
            const { data, totalPages, currentPage } = res.data;
            setDetails(data);
            setTotalPages(totalPages);
            setPage(currentPage);
        } catch (err) {
            alert(err);
        }
    }

    const exportToPDF = (details) => {
        const doc = new jsPDF();
    
        // Título centrado
        doc.setFontSize(18);
        doc.text('REPORTE DE PACIENTES ATENDIDOS', 105, 10, { align: 'center' });
    
        // Espaciado después del título
        doc.setFontSize(12);
        doc.text('Fecha: ' + new Date().toLocaleDateString(), 10, 20);
    
        // Definir las columnas de la tabla
        const encabezado = ['Nombre', 'Apellidos', 'Curso', 'Médico', 'Fecha de atención', 'Diagnóstico', 'Tratamiento', 'Observaciones'];
    
        // Convertir los detalles en el formato necesario para agregar a la tabla
        const datos = details.map((detail) => [
            detail.Nombre,
            detail.Apellidos,
            detail.Curso,
            detail.Médico,
            new Date(detail.fechaAtendido).toLocaleDateString(),
            detail.Diagnóstico,
            detail.Tratamiento,
            detail.Observaciones,
        ]);
    
        // Generar la tabla automáticamente con jsPDF-autotable
        doc.autoTable({
            head: [encabezado],
            body: datos,
            startY: 30,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }, // Estilo para la cabecera
        });
    
        // Descargar el archivo PDF
        doc.save('Reporte_Pacientes.pdf');
    };

    const exportToExcel = (details) => {
        // Crear una nueva hoja de trabajo
        const wb = XLSX.utils.book_new();
      
        // Datos del encabezado con el título centrado
        const titulo = [['REPORTE DE PACIENTES ATENDIDOS']];
        const encabezado = [
          ['Nombre', 'Apellidos', 'Curso', 'Médico', 'Fecha de atención', 'Diagnóstico', 'Tratamiento', 'Observaciones']
        ];
      
        // Convertir los detalles en el formato necesario para agregar a la hoja
        const datos = details.map((detail) => [
          detail.Nombre,
          detail.Apellidos,
          detail.Curso,
          detail.Médico,
          new Date(detail.fechaAtendido).toLocaleDateString(),
          detail.Diagnóstico,
          detail.Tratamiento,
          detail.Observaciones,
        ]);
      
        // Combinar título, encabezado y datos
        const ws_data = [...titulo, ...encabezado, ...datos];
      
        // Crear la hoja de trabajo
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
      
        // Fusionar las celdas para centrar el título en las columnas de la tabla
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];
      
        // Estilo en negrita para la cabecera
        const headerRange = XLSX.utils.decode_range('A2:H2');
        for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 1, c: C }); // La cabecera está en la segunda fila
          if (!ws[cellAddress]) continue;
          ws[cellAddress].s = {
            font: { bold: true }, // Establecer el texto en negrita
          };
        }
      
        // Agregar la hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      
        // Generar el archivo Excel
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
        // Guardar el archivo Excel
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'Reporte_Pacientes.xlsx');
      };

    const hasData = details && details.length > 0;

    return (
        <div className="min-h-screen bg-[#ffffff] flex flex-col items-center p-6">
            <div className="w-full max-w-2x1 bg-[#ffffff] p-6 rounded-lg shadow-lg">
                <h1 className='text-3xl font-bold text-[#063255] text-center mb-6'>Libro de consultas médicas</h1>
                <div className="flex flex-wrap justify-between items-center mb-4 space-y-2">
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="text-[#063255] font-bold">Colegio:</label>
                        {ridFK === 3 ? (
                            <span>{colegio}</span>
                        ) : (
                            <select
                                value={colegio}
                                onChange={(e) => setColegio(e.target.value)}
                                className="border border-gray-300 rounded-md p-2"
                            >
                                <option value='Todos'>Todos</option> {/* Opción para mostrar todos */}
                                {Array.from(new Set(data.map(item => item.nombre))).map(nombre => (
                                    <option key={nombre} value={nombre}>{nombre}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="text-[#063255] font-bold">Gestión:</label>
                        <select
                            value={gestion}
                            onChange={(e) => setGestion(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            <option value="Todos">Todos</option> {/* Opción para mostrar todos */}
                            {Array.from(new Set(data.map(item => item.gestion))).map(gestion => (
                                <option key={gestion} value={gestion}>{gestion}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="text-[#063255] font-bold">Mes:</label>
                        <select
                            value={mes}
                            onChange={(e) => setMes(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            <option value="Todos">Todos</option> {/* Opción para mostrar todos */}
                            {Array.from(new Set(data.map(item => item.mes))).map(mes => (
                                <option key={mes} value={mes}>{mes}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200"
                    >
                        Enviar
                    </button>
                </div>

                {isSubmitted && !hasData && (
                    <div className="text-center mt-6">
                        <p>No hay datos</p>
                        <Link to={`/createRegistro/${lid}`}>
                            <button
                                className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200 mt-4"
                            >
                                Crear registro
                            </button>
                        </Link>
                    </div>
                )}

                {isSubmitted && hasData && (
                    <div className="mt-6">
                        <div className="overflow-x-auto">
                            <div className="flex justify-end mb-4">
                                <Link to={`/createRegistro/${lid}`}>
                                    <button className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200">
                                        Crear registro
                                    </button>
                                </Link>
                            </div>
                            <label htmlFor="searchType" className="text-[#063255] font-bold">Buscar asegurado por:</label>
                            <div className="flex flex-wrap justify-between items-center mb-4 space-y-2">
                                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <label className="text-[#063255] font-bold">Tipo de búsqueda:</label>
                                    <select
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="cedula">Carnet de Identidad</option>
                                        <option value="nombre">Nombre</option>
                                    </select>
                                </div>

                                {searchType === 'nombre' ? (
                                    <>
                                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                            <label className="text-[#063255] font-bold">Nombre:</label>
                                            <input
                                                type="text"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                className="flex-1 border border-gray-300 rounded-md p-2"
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                            <label className="text-[#063255] font-bold">Apellido Paterno:</label>
                                            <input
                                                type="text"
                                                value={apellidoPaterno}
                                                onChange={(e) => setApellidoPaterno(e.target.value)}
                                                className="flex-1 border border-gray-300 rounded-md p-2"
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                            <label className="text-[#063255] font-bold">Apellido Materno:</label>
                                            <input
                                                type="text"
                                                value={apellidoMaterno}
                                                onChange={(e) => setApellidoMaterno(e.target.value)}
                                                className="flex-1 border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                        <label className="text-[#063255] font-bold">Carnet de Identidad:</label>
                                        <input
                                            type="text"
                                            value={cedula}
                                            onChange={(e) => setCedula(e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={handleFilter}
                                    className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200"
                                >
                                    Filtrar
                                </button>
                            </div>
                        </div>

                        {/* Aquí muestra los detalles */}
                        <div className="mt-6">
                        <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => exportToExcel(details)}
                                    className="bg-[#009ab2] text-white px-4 py-2 rounded-md mr- hover:bg-[#007a8a] transition-colors duration-200"
                                >
                                    Exportar a Excel
                                </button>
                                <button
                                    onClick={() => exportToPDF(details)}
                                    className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200"
                                >
                                    Exportar a PDF
                                </button>
                            </div>
                        <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#063255] text-white">
                                        <th className="px-4 py-2 border">Nombre</th>
                                        <th className="px-4 py-2 border">Apellidos</th>
                                        <th className="px-4 py-2 border">Curso</th>
                                        <th className="px-4 py-2 border">Médico</th>
                                        <th className="px-4 py-2 border">Fecha de atención</th>
                                        <th className="px-4 py-2 border">Diagnóstico</th>
                                        <th className="px-4 py-2 border">Tratamiento</th>                                        
                                        <th className="px-4 py-2 border">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.map((detail, index) => (
                                        <tr key={index} className="even:bg-gray-100">
                                                <td key={index} className="px-4 py-2 text-center border">{detail.Nombre}</td>
                                                <td key={index} className="px-4 py-2 text-center border">{detail.Apellidos}</td>
                                                <td key={index} className="px-4 py-2 text-center border">{detail.Curso}</td>
                                                <td key={index} className="px-4 py-2 text-center border">{detail.Médico}</td>
                                                <td key={index} className="px-4 py-2 text-center border">{new Date(detail.fechaAtendido).toLocaleDateString('es-ES')}</td>
                                                <td key={index} className="px-4 py-2 text-center border">{detail.Diagnóstico}</td>
                                                <td key={index} className="px-4 py-2 text-center border">{detail.Tratamiento}</td>
                                                <td key={index} className="px-4 py-2 text-center border">{detail.Observaciones}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        

                            <div className="flex justify-center space-x-8 y-8 mt-6">
                                <button
                                    onClick={() => setPage(page > 1 ? page - 1 : 1)}
                                    disabled={page === 1}
                                    className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200"
                                >
                                    Anterior
                                </button>
                                <span className="text-center mt-2">Página {page} de {totalPages}</span>
                                <button
                                    onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                                    disabled={page === totalPages}
                                    className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DropdownSelection;
