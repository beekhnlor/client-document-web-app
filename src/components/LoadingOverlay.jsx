// src/components/LoadingOverlay.jsx
import React from 'react';
import { Loader2 } from 'lucide-react'; // ใช้ Icon หมุนๆ สวยๆ จาก Lucide

const LoadingOverlay = () => {
  return (
    
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-white">
      <Loader2 className="animate-spin text-blue-600 h-16 w-16" />
    </div>
  );
};

export default LoadingOverlay;