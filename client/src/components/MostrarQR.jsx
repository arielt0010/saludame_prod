import React from 'react'
import ARAKUARENDA from '../assets/QR colegios/ARAKUARENDA.jpeg';
import CRISTO_REY from '../assets/QR colegios/CRISTO REY.jpeg';
import JESUS_MAESTRO from '../assets/QR colegios/JESUS MAESTRO.jpeg';
import JUAN_PABLO_2 from '../assets/QR colegios/JUAN PABLO 2.jpeg';
import SANTA_ANA from '../assets/QR colegios/SANTA ANA.jpeg';
import SIERRA from '../assets/QR colegios/SIERRA.jpeg';
import UBOLDI from '../assets/QR colegios/UBOLDI.jpeg';

const MostrarQR = ({nombre_colegio}) => {
    const normalizeName = (name) => {
      console.log(name.trim().toLowerCase().replace(/\s+/g, '_'))
      return name.trim().toLowerCase().replace(/\s+/g, '_');
        
      };
    
      // Normalizar el nombre del colegio
      const normalizedColegio = normalizeName(nombre_colegio);
      

    const imagenes = {
        colegio_arakuarenda : ARAKUARENDA,
        colegio_cristo_rey : CRISTO_REY,
        colegio_jesus_maestro : JESUS_MAESTRO,
        colegio_juan_pablo_2 : JUAN_PABLO_2,
        colegio_santa_ana : SANTA_ANA,
        colegio_sierra : SIERRA,
        colegio_uboldi : UBOLDI,
    };

    const imagenSrc = imagenes[normalizedColegio] ||  <div className="w-24 h-24 border-2 border-dashed border-gray-400 flex items-center justify-center text-xs text-gray-500">
    [Imagen]
  </div>;

    return (
    <div>
        <img src={imagenSrc} alt={`Imagen de ${nombre_colegio}`} className="w-full h-auto" />
    </div>
  )
}

export default MostrarQR