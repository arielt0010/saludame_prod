import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneradorPDF from '../../components/GeneradorPDF';

const Pagos = () => {
  axios.defaults.withCredentials = true;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);  // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  const fetchData = (currentPage) => {
    axios.get(`http://localhost:8081/pagos?page=${currentPage}&limit=15`)
      .then(res => {
        setData(res.data.items); // Suponiendo que 'items' es el array de pagos
        setTotalPages(res.data.totalPages); // Total de páginas
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

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center p-6">
      <div className="w-full max-w-2x1 bg-[#ffffff] p-6 rounded-lg shadow-lg">
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleCreate}
            className="bg-[#009ab2] text-white px-4 py-2 rounded-md hover:bg-[#007a8a] transition-colors duration-200"
          >
            Crear pago
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#063255] text-white">
                {/* Cabezera de la tabla */}
                <th className="px-4 py-2 border">Id</th>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Colegio</th>
                  <th className="px-4 py-2 border">Curso</th>
                  <th className="px-4 py-2 border">Gestión</th>
                  <th className="px-4 py-2 border">Fecha de pago</th>
                  <th className="px-4 py-2 border">Monto</th>
                  <th className="px-4 py-2 border">Forma de pago</th>
                  <th className="px-4 py-2 border">Usuario</th>
                  <th className="px-4 py-2 border">Fecha agregado</th>
                  <th className="px-4 py-2 border">Estado</th>
                  <th className="px-4 py-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {data.map((pagos, index) => (
                <tr key={index} className="even:bg-gray-100">
                    <td className="px-4 py-2 border">{pagos.Id}</td>
                    <td className="px-4 py-2 border">{pagos.Nombre}</td>
                    <td className="px-4 py-2 border">{pagos.Colegio}</td>
                    <td className="px-4 py-2 border">{pagos.Curso}</td>
                    <td className="px-4 py-2 border">{pagos.Gestion}</td>
                    <td className="px-4 py-2 border">{new Date(pagos.fechaPago).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{pagos.monto}</td>
                    <td className="px-4 py-2 border">{pagos.formaPago}</td>
                    <td className="px-4 py-2 border">{pagos.usuario}</td>
                    <td className="px-4 py-2 border">{new Date(pagos.fechaAgregado).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{pagos.Estado}</td>
                    <td className="px-4 py-2 border">
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
