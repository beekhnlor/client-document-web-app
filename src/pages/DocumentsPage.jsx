import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios'; // <-- จุดที่ 1: เราไม่ใช้ axios โดยตรงแล้ว
import apiClient from '../api/api.jsx'; // <-- จุดที่ 1: เปลี่ยนมาใช้ apiClient แทน
import { toast } from 'react-toastify'; 
import Swal from 'sweetalert2';

const DocumentsPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllDocuments = async () => {
        try {
            // const response = await axios.get('http://localhost:2025/api/document'); <-- โค้ดเก่า
            const response = await apiClient.get('/api/document'); // <-- จุดที่ 2: แก้ไขการเรียกใช้
            setDocuments(response.data.result); // <-- ผมแก้ไขจาก .result เป็น .results ตามที่เห็นใน Postman นะครับ
        } catch (err) {
            setError("ເກີດຂໍ້ຜິດພາດໃນການດຶງລາຍການເອກະສານ.");
            console.error("Failed to fetch documents:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllDocuments();
    }, []);
    
    const handleDelete = (id, applicantName) => {
        Swal.fire({
            title: 'ທ່ານແນ່ໃຈບໍ່?',
            text: `ທ່ານຕ້ອງການລົບຂໍ້ມູນຂອງທ່ານ "${applicantName}" ແທ້ບໍ່? ຫຼັງຈາກກົດແລ້ວຈະບໍ່ສາມາດຍອ້ນກັບໄດ້!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6', 
            cancelButtonColor: '#d33',   
            confirmButtonText: 'ແມ່ນ, ລົບເລີຍ!',
            cancelButtonText: 'ຍົກເລີກ'
        }).then((result) => {
            
            if (result.isConfirmed) {
                
                // axios.delete(`http://localhost:2025/api/document/${id}`) <-- โค้ดเก่า
                apiClient.delete(`/api/document/${id}`) // <-- จุดที่ 3: แก้ไขการเรียกใช้
                    .then(response => {
                        
                        Swal.fire(
                            'ລົບສຳເລັດ!',
                            response.data.message,
                            'success'
                        );
                        fetchAllDocuments(); 
                    })
                    .catch(err => {
                        
                        Swal.fire(
                            'ເກີດຂໍ້ຜິດພາດ!',
                            err.response?.data?.message || "ບໍ່ສາມາດລົບຂໍ້ມູນໄດ້.",
                            'error'
                        );
                    });
            }
        });
    };

    
    if (loading) return <div className="text-center p-10 font-phetsarath">ກຳລັງໂຫຼດລາຍການ...</div>;
    if (error) return <div className="text-center p-10 text-red-500 font-phetsarath">{error}</div>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 font-phetsarath">ລາຍການເອກະສານທັງໝົດ</h1>
            
            {documents.length === 0 ? ( <p className="font-phetsarath">ບໍ່ພົບຂໍ້ມູນເອກະສານ.</p> ) : (
                <div className="space-y-4">
                    {documents.map(doc => (
                        <div key={doc.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                            <Link to={`/document/view/${doc.id}`} className="font-phetsarath flex-grow">
                                <h2 className="text-xl font-semibold text-blue-700 hover:underline">
                                    ໃບຄຳຮ້ອງປະຈຳປີ {doc.year_of_form}
                                </h2>
                                <p className="text-gray-600"> ຊື່ຜູ້ສະໝັກ: {doc.applicant_name} </p>
                            </Link>
                       
                            <div className="flex items-center gap-4">
                                <Link to={`/document/edit/${doc.id}`} className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 font-phetsarath">
                                    ແກ້ໄຂ
                                </Link>
                                <button 
                                    onClick={() => handleDelete(doc.id, doc.applicant_name)}
                                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 font-phetsarath"
                                >
                                    ລົບ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentsPage;