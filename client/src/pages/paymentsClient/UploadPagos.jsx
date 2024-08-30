import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MostrarQR from '../../components/MostrarQR';
import { useRef } from 'react';

const CancelarSeguro = () => {
    axios.defaults.withCredentials = true;
    const location = useLocation();
    const navigate = useNavigate();
    const {cid} = location.state;
    const uid = 26;
    const [precio, setPrecio] = useState(0);
    const [nombreColegio, setNombreColegio] = useState('');
    const gestion = new Date().getFullYear();
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    
    const handleButtonClick = () => {
        fileInputRef.current.click();
      };
    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
    };

    useEffect(() => {
        axios.get('http://localhost:8081/getColegio/'+ cid)
            .then(res => {
                if (Array.isArray(res.data)) {
                    setPrecio(res.data[0].precio);
                    setNombreColegio(res.data[0].nombre);
                } else {
                    alert("Error al cargar los datos");
                }
            })
            .catch(err => alert(err))
    }, [])

    const handleSubmit = async () => {
        axios.post('http://localhost:8081/createClientPayment', {
        gestion, 
        monto: precio, 
        cid,
        uid,
      })
      .then(res => {
          console.log(res.data)
          const formData = new FormData();
          formData.append('image', selectedFile);
          formData.append('cid', cid);
          handleUpload(formData)
      })
    }

    const handleUpload = async (formData) => {
      try {
        const response = await axios.post('http://localhost:8081/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        if (response.status === 200) {
          navigate(`/datosTutor/`, {state: {cid  : cid}})
        }
      } catch (err) {
        console.error('Error al subir el archivo:', err);
      }
    };

     

    return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Instrucciones</h1>
      <p className="mb-4 text-gray-700">
        Por favor, haz una transferencia con el banco de tu preferencia:
        <br />
        <strong>Numero de cuenta:</strong> XXXXXX
        <br />
        <strong>Nombre:</strong> SaludAME SRL
        <br />
        <strong>Monto a cancelar:</strong> {precio} bolivianos.
      </p>
      <div className="flex justify-center mb-4">
        <div className="w-30 h-30 border-1 border-dashed border-gray-400 flex items-center justify-center text-xs text-gray-500"> 
             <MostrarQR nombre_colegio={nombreColegio}/>
        </div>
      </div>
      <p className="mb-4 text-center text-gray-700">
        Si ya has cancelado, sube una foto de tu comprobante de pago
      </p>
      <div className="flex justify-between items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}  // Escondiendo el input de archivo
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={handleButtonClick}
      >
        <span className="mr-2">📤</span> Subir imagen
      </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={() => handleSubmit()}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default CancelarSeguro;
