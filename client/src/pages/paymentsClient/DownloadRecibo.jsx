import React, {useState} from 'react'
import axios from 'axios'
import GeneradorPDF from '../../components/GeneradorPDF';
import { Link } from 'react-router-dom'

const DownloadRecibo = () => {
  axios.defaults.withCredentials = true;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showTable, setShowTable] = useState(false); // Nueva variable para controlar la visibilidad de la tabla
  
  const [filtroTipo, setFiltroTipo] = useState('ci'); 
  const [ci, setCi] = useState(''); 
  const [nombreCompleto, setNombreCompleto] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: ''
  });
  
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleFilter = () => {
    let tipoFiltro = '';
    let params = {};
    let hasFilter = false;

    if (filtroTipo === 'ci' && ci) {
      tipoFiltro = 'ci';
      hasFilter = true; // Se ha ingresado un filtro válido
      params = {
        tipo: tipoFiltro,
        ci: ci, 
        limit: 15
      };
    } else if (filtroTipo === 'nombre') {
      const { nombre, apellidoPaterno, apellidoMaterno } = nombreCompleto;
  
      if (nombre || apellidoPaterno || apellidoMaterno) {
        tipoFiltro = 'nombre';
        hasFilter = true;
        params = {
          tipo: tipoFiltro,
          nombre: nombre || '', 
          apellidoPaterno: apellidoPaterno || '', 
          apellidoMaterno: apellidoMaterno || '', 
          limit: 15
        };
      }
    } 
    
    if (!hasFilter) {
      setShowTable(false); // Ocultar la tabla si no hay filtros aplicados
      alert('Por favor ingresa un criterio de búsqueda antes de filtrar.');
      return;
    }
    
    axios.get('http://localhost:8081/showPagos', { params })
      .then(res => {
        setData(res.data.items);
        setTotalPages(res.data.totalPages);
        setShowTable(true); // Mostrar la tabla si se aplica un filtro válido
      })
      .catch(err => alert('Error al aplicar el filtro: ' + err));
  };

  const handleCreatePDF = (pagos) => {
    const { Id, Nombre, Curso, Gestion, fechaPago, monto } = pagos;
    const [year, month, day] = fechaPago.split('T')[0].split('-');
    GeneradorPDF(Id, Nombre, monto, day, month, year, '0', Curso, Gestion);
  };

  return (
    <div className='min-h-screen bg-[#ffffff] flex flex-col items-center p-6'>
      {/* Título y descripción */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#063255]">Descargar Recibo de Pago</h1>
        <p className="text-gray-600 mt-4">Utiliza los filtros a continuación para buscar los pagos y descargar los recibos correspondientes.</p>
      </div>
      
      {/* Filtros */}
      <div className="mb-4 flex items-center w-full">
        {/* Filtro de selección */}
        <label className="text-[#063255] font-bold">Tipo de filtro:</label>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border border-gray-300 rounded-md p-2 ml-2"
        >
          <option value="">Seleccionar filtro</option>
          <option value="ci">Carnet de Identidad</option>
          <option value="nombre">Nombre Completo</option>
        </select>

        {filtroTipo === 'ci' && (
          <div className="mt-2 flex items-center ml-4 flex-1">
            <label className="text-[#063255] font-bold mr-2">Carnet de Identidad:</label>
            <input
              type="text"
              placeholder="Ingresa el CI"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
        )}

        {filtroTipo === 'nombre' && (
          <div className="mt-2 flex items-center ml-4 space-x-2 flex-1">
            <label className="text-[#063255] font-bold mr-2">Nombre:</label>
            <input
              type="text"
              placeholder="Nombre"
              value={nombreCompleto.nombre}
              onChange={(e) => setNombreCompleto({ ...nombreCompleto, nombre: e.target.value })}
              className="border border-gray-300 rounded-md p-2 flex-1"
            />
            <label className="text-[#063255] font-bold mr-2">Apellido Paterno:</label>
            <input
              type="text"
              placeholder="Apellido Paterno"
              value={nombreCompleto.apellidoPaterno}
              onChange={(e) => setNombreCompleto({ ...nombreCompleto, apellidoPaterno: e.target.value })}
              className="border border-gray-300 rounded-md p-2 flex-1"
            />
            <label className="text-[#063255] font-bold mr-2">Apellido Materno:</label>
            <input
              type="text"
              placeholder="Apellido Materno"
              value={nombreCompleto.apellidoMaterno}
              onChange={(e) => setNombreCompleto({ ...nombreCompleto, apellidoMaterno: e.target.value })}
              className="border border-gray-300 rounded-md p-2 flex-1"
            />
          </div>
        )}

        <button
          onClick={handleFilter}
          className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200 mt-4 ml-4"
        >
          Filtrar
        </button>
      </div>

      {/* Tabla de pagos */}
      {showTable && data.length > 0 && (
        <div className="w-full max-w-full">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#063255] text-white">
                <th className="px-4 py-2 border">Id</th>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Carnet de Identidad</th>
                <th className="px-4 py-2 border">Colegio</th>
                <th className="px-4 py-2 border">Gestión</th>
                <th className="px-4 py-2 border">Fecha de pago</th>
                <th className="px-4 py-2 border">Monto</th>
                <th className="px-4 py-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {data.map((pagos, index) => (
                <tr key={index} className="even:bg-gray-100 text-center">
                  <td className="px-4 py-2 border">{pagos.Id}</td>
                  <td className="px-4 py-2 border">{pagos.Nombre}</td>
                  <td className="px-4 py-2 border">{pagos.CI}</td>
                  <td className="px-4 py-2 border">{pagos.Colegio}</td>
                  <td className="px-4 py-2 border">{pagos.Gestion}</td>
                  <td className="px-4 py-2 border">{new Date(pagos.fechaPago).toLocaleDateString('es-ES')}</td>
                  <td className="px-4 py-2 border">{pagos.monto}</td>
                  <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleCreatePDF(pagos)}
                        className="bg-[#009ab2] text-white px-3 py-1 rounded-md hover:bg-[#007a8a] transition-colors duration-200"
                      >
                        Descargar recibo
                      </button>                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        <Link to="/">
          <button className="bg-[#4a4a4a] text-white px-3 py-3 rounded-md hover:bg-[#2b2b2b] transition-colors duration-200 w-full mt-6">
            Volver al inicio
          </button>
        </Link>
    </div>
  );
};

export default DownloadRecibo;
