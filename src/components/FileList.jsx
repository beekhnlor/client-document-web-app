import React, { useState, useEffect } from 'react';
import apiClient from '../api/api'; 
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const fetchFiles = async () => {
    try {
      const response = await apiClient.get('/api/getupload'); 
      setFiles(Array.isArray(response.data.result) ? response.data.result : []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadStatus({ message: 'ກະລຸນາເລືອກໄຟລ໌ກ່ອນ', type: 'error' });
      return;
    }
    setIsUploading(true);
    setUploadStatus({ message: 'ກຳລັງອັບໂຫຼດ...', type: 'info' });
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('file', selectedFiles[i]);
    }
    try {
      await apiClient.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus({ message: 'ອັບໂຫຼດສຳເລັດ!', type: 'success' });
      setSelectedFiles(null);
      document.getElementById('file-input').value = null;
      await fetchFiles(); 
      setTimeout(() => setUploadStatus(''), 5000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus({ message: 'ອັບໂຫຼດບໍ່ສຳເລັດ. ກະລຸນາລອງໃໝ່.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  // --- ฟังก์ชันใหม่ สำหรับตรวจสอบชนิดไฟล์ ---
  const getFileType = (filename) => {
    if (!filename) return 'unknown';
    const extension = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) {
      return 'pdf';
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    }
    return 'other';
  };
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="p-4 md:p-2 text-gray-200">
      
      {/* --- ส่วนฟอร์มอัปโหลด (เหมือนเดิม) --- */}
      <div className="mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white font-phetsarath">ອັບໂຫຼດໄຟລ໌</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
          />
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFiles}
            className="min-w-32 flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 focus:bg-blue-700 transition duration-150 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            <span className="font-phetsarath">{isUploading ? 'ກຳລັງອັບໂຫຼດ...' : 'ອັບໂຫຼດ'}</span>
          </button>
        </div>
        {uploadStatus && (
          <p className={`mt-3 text-sm font-phetsarath ${
              uploadStatus.type === 'success' ? 'text-green-400' : 
              uploadStatus.type === 'error' ? 'text-red-400' : 'text-gray-400'
            }`}
          >
            {uploadStatus.message}
          </p>
        )}
      </div>

      <hr className="border-t border-gray-700 my-8" />
      
      {/* --- ส่วนแสดงผลไฟล์ทั้งหมด --- */}
      {files.length > 0 && (
        <>
          {/* --- แก้ไขตรงนี้: เปลี่ยนจากการ filter มาเป็นการ map แล้วใช้เงื่อนไขข้างใน --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {files.map(file => {
              const fileType = getFileType(file.files);

              // ถ้าเป็น PDF ให้แสดงผลแบบเดิม
              if (fileType === 'pdf') {
                return (
                  <div key={file.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg flex flex-col h-[80vh]">
                    <h3 className="p-3 bg-gray-700 text-gray-100 font-semibold border-b border-gray-600 truncate font-phetsarath">
                        {file.original_name} 
                    </h3>
                    <div className="flex-grow">
                      <embed 
                        src={`${baseUrl}/uploads/${file.files}`} 
                        type="application/pdf" 
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                );
              }

              if (fileType === 'image') {
                return (
                  <div key={file.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg flex flex-col h-[80vh]">
                    <h3 className="p-6 bg-gray-700 text-gray-100 font-semibold border-b border-gray-600 truncate font-phetsarath">
                        {file.original_name || file.files} 
                    </h3>
                    <div className="flex-grow p-4 flex items-center justify-center">
                      <img 
                        src={`${baseUrl}/uploads/${file.files}`} 
                        alt={file.original_name || 'Uploaded Image'}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                );
              }
            
              return null; 
            })}
          </div>
        </>
      )}

      {!isUploading && files.length === 0 && (
          <p className="text-center text-gray-500 py-10 font-phetsarath">ບໍ່ມີໄຟລ໌ PDF ໃຫ້ສະແດງ. ກະລຸນາອັບໂຫຼດໄຟລ໌.</p>
      )}
    </div>
  );
};

export default FileList;