// Notification.js
import React, { useEffect } from 'react';

// Define the Notification component
const Notification = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 400); // Notification duration

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`fixed top-[50px] right-4 bg-red-500 text-white px-4 py-2 rounded-md transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
