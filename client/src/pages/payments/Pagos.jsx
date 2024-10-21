import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';
import GeneradorPDF from '../../components/GeneradorPDF';

const Pagos = () => {
  axios.defaults.withCredentials = true;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Nuevos estados para el filtro
  const [filtroTipo, setFiltroTipo] = useState(''); // Para controlar el tipo de filtro (CI o nombre completo)
  const [ci, setCi] = useState(''); // Valor del CI
  const [nombreCompleto, setNombreCompleto] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: ''
  });

  //imagen superpuesta
  const [selectedImage, setSelectedImage] = useState(null); // Para almacenar la imagen seleccionada
  const [showImageModal, setShowImageModal] = useState(false);

  const fetchData = (currentPage) => {
    axios.get(`http://localhost:8081/pagos?page=${currentPage}&limit=15`)
      .then(res => {
        setData(res.data.items);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => alert(err));
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/createPayment");
  };

  const handleCreatePDF = (pagos) => {
    const { Id, Nombre, Curso, Gestion, fechaPago, monto } = pagos;
    const [year, month, day] = fechaPago.split('T')[0].split('-');
    GeneradorPDF(Id, Nombre, monto, day, month, year, '0', Curso, Gestion);
  };

  const handleApprove = (pagos) => {
    const { Id } = pagos;
    axios.put('http://localhost:8081/aprobarPago/' + Id)
      .then(res => {
        handleCreatePDF(pagos);
        window.location.reload();
      })
      .catch(err => alert(err));
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };


  const handleFilter = () => {
    let tipoFiltro = '';
    let params = {};
  
    if (filtroTipo === 'ci' && ci) {
      tipoFiltro = 'ci';
      params = {
        tipo: tipoFiltro,
        ci: ci, // El valor de CI ingresado por el usuario
        limit: 15
      };
    } else if (filtroTipo === 'nombre') {
      const { nombre, apellidoPaterno, apellidoMaterno } = nombreCompleto;
  
      if (nombre || apellidoPaterno || apellidoMaterno) {
        tipoFiltro = 'nombre';
        // Solo pasar los valores que no estén vacíos
        params = {
          tipo: tipoFiltro,
          nombre: nombre || '', // Nombre o cadena vacía
          apellidoPaterno: apellidoPaterno || '', // Apellido Paterno o cadena vacía
          apellidoMaterno: apellidoMaterno || '', // Apellido Materno o cadena vacía
          limit: 15
        };
      } else {
        alert('Por favor llena al menos uno de los campos del nombre.');
        return;
      }
    } else {
      alert('Por favor selecciona un tipo de filtro y llena los campos.');
      return;
    }
  
    // Realizar la solicitud con los parámetros correctos
    axios.get('http://localhost:8081/pagosFiltrados', { params })
      .then(res => {
        setData(res.data.items);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => alert('Error al aplicar el filtro: ' + err));
  };
  

  const handleShowImage = (Id) => {
    // Hacer la petición para obtener la ruta del comprobante
    axios.get(`http://localhost:8081/showComprobante/${Id}`)
      .then(response => {
        console.log('Response Data:', response.data); // Verifica lo que está llegando en la respuesta
  
        if (Array.isArray(response.data) && response.data.length > 0) {
          const comprobantePago = response.data[0].comprobantePago;
  
          if (typeof comprobantePago === 'string') {
            // Reemplazar barras invertidas por barras normales (para asegurar compatibilidad en la URL)
            let imageUrl = `http://localhost:8081/${comprobantePago.replace(/\\/g, '/')}`;
            
            imageUrl = encodeURI(imageUrl);
            
            // Mostrar la imagen en el modal
            setSelectedImage(imageUrl); // Asignamos la imagen descargada
            setShowImageModal(true); // Mostramos el modal con la imagen
          } else {
            alert('El comprobante de pago no existe/no se pudo cargar correctamente.');
          }
        } else {
          alert('No se encontró el comprobante en la respuesta.');
        }
      })
      .catch(err => alert('Error al cargar el comprobante: ' + err));
  };
  

  const handleCloseImage = () => {
    setShowImageModal(false);  // Oculta la imagen
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center p-6">
      <div className="w-full max-w-2x1 bg-[#ffffff] p-6 rounded-lg shadow-lg">
        <div className="mb-4 flex justify-between">
          <h1 className='text-3xl font-bold text-[#063255] mb-3'>Pagos</h1>
        </div>
        
        {/*Filtros */}
      <div className="mb-4 flex items-center w-full">
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
                <th className="px-4 py-2 border">Usuario</th>
                <th className="px-4 py-2 border">Estado</th>
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
                  <td className="px-4 py-2 border">{pagos.usuario}</td>
                  <td className="px-4 py-2 border">{pagos.Estado}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className='bg-[#009ab2] text-white px-3 py-1 rounded-md hover:bg-[#007a8a] transition-colors duration-200 mr-2'
                      onClick={() => handleShowImage(pagos.Id)}
                    >
                      Ver comprobante
                    </button>
                    {pagos.Estado === "Aprobado" ? 
                      <button
                        onClick={() => handleCreatePDF(pagos)}
                        className="bg-[#009ab2] text-white px-3 py-1 rounded-md hover:bg-[#007a8a] transition-colors duration-200"
                      >
                        Descargar recibo
                      </button>
                    :
                      <button
                        onClick={() => handleApprove(pagos)}
                        className="bg-[#009ab2] text-white px-3 py-1 rounded-md hover:bg-[#007a8a] transition-colors duration-200"
                      >
                        Aprobar pago
                      </button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de la imagen superpuesta */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded-md shadow-lg">
              <button
                className="absolute top-5 right-5 bg-red-600 text-white rounded-md px-4 py-2 text-lg transition-transform transform hover:scale-105"
                onClick={() => handleCloseImage()}
              >
                X
              </button>
              <img 
                src={selectedImage} 
                alt="Comprobante" 
                className="max-w-[70%] max-h-[70%] object-contain"
              />
            </div>
          </div>
        )}


        {/* Paginación */}
        <div className="flex justify-center space-x-8 y-8 mt-6">
          <button 
            onClick={handlePreviousPage} 
            disabled={page === 1} 
            className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200"
          >
            Anterior
          </button>
          <span className='text-center mt-2'>Página {page} de {totalPages}</span>
          <button 
            onClick={handleNextPage} 
            disabled={page === totalPages} 
            className="bg-[#063255] text-white px-4 py-2 rounded-md hover:bg-[#004a6c] transition-colors duration-200"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagos;
