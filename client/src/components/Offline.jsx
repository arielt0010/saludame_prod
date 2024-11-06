import React, { useState, useEffect } from 'react';

const OfflineNotification = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      setShowNotification(true); // Mostrar el mensaje cuando esté offline
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || !showNotification) {
    return null;
  }

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-400 text-gray-800 py-2 px-4 rounded-lg shadow-lg z-50 text-sm flex justify-between items-center">
      <p className='text-center 2xl:text-3xl'>Estás sin conexión.</p>
      <button 
        className="ml-4 bg-gray-800 text-white rounded-full px-2 py-1 text-xs"
        onClick={() => setShowNotification(false)}
      >
        Cerrar
      </button>
    </div>
  );
};

export default OfflineNotification;
