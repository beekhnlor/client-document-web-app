import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, BuildingOffice2Icon } from "@heroicons/react/24/solid";
import apiClient from "../../api/api";
import accouting  from '../../assets/BCEL.jpg'

const CompanySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [initialCompanies, setInitialCompanies] = useState([]);

  // แยก State การโหลดออกจากกันเพื่อความชัดเจน
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // << สำคัญ: เริ่มต้นเป็น true

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลเริ่มต้น
  const fetchInitialCompanies = useCallback(async () => {
    setIsInitialLoading(true); // เริ่มโหลด
    setError(null);
    try {
      const response = await apiClient.get('/api/search?q='); // เรียก API ที่ q ว่าง
      setInitialCompanies(response.data);
    } catch (err) {
      setError("Failed to load initial companies.");
      setInitialCompanies([]);
    } finally {
      setIsInitialLoading(false); // โหลดเสร็จสิ้น
    }
  }, []);

  // ฟังก์ชันค้นหา
  const searchCompanies = useCallback(async (query) => {
    if (!query) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await apiClient.get(`/api/search?q=${query}`);
      setResults(response.data);
    } catch (err) {
      // สามารถจัดการ error ของการค้นหาได้ที่นี่
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialCompanies();
  }, [fetchInitialCompanies]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      searchCompanies(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm, searchCompanies]);

  const handleCompanyClick = (companyId) => {
    navigate('/document/create');
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 py-12 px-4">
      {/* Search Component */}
      <div className="w-full max-w-md mx-auto relative mb-16">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ຄົ້ນຫາຊື່ບໍລິສັດ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400"
          />
        </div>
        {searchTerm && (
          <div className="absolute top-full left-0 w-full mt-2 z-10">
            {isSearching ? (
              <div className="bg-gray-800 rounded-lg p-3 text-center text-gray-400">ກຳລັງຄົ້ນຫາ...</div>
            ) : results.length > 0 ? (
              <ul className="bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {results.map((company) => (
                  <li key={company.id} onClick={() => handleCompanyClick(company.id)} className="p-3 text-white border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer">
                    {company.company_name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-gray-800 rounded-lg p-3 text-center text-gray-500">ບໍ່ພົບຂໍ້ມູນບໍລິສັດ</div>
            )}
          </div>
        )}
      </div>

      {/* Initial Company List */}
      <div>
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          ລາຍຊື່ບໍລິສັດ
        </h2>
        {isInitialLoading ? (
          <p className="text-gray-500 mt-4 text-center">ກຳລັງໂຫຼດຂໍ້ມູນບໍລິສັດ...</p>
        ) : initialCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialCompanies.map((company) => (
              //  =========== โค้ดที่แก้ไขแล้วอยู่ตรงนี้ =============
              <div 
                key={company.id} 
                onClick={() => handleCompanyClick(company.id)} 
                className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 hover:shadow-blue-500/20 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <img 
                    src={accouting} 
                    alt={company.company_name} 
                    className="w-full h-40 object-cover"
                />
                <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white font-phetsarath">{company.company_name}</h3>
                    <p className="text-sm text-gray-400 mt-2 font-phetsarath">ກົດເພື່ອເລືອກສ້າງເອກະສານ</p>
                </div>
              </div>
              //  ==============================================
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-4 text-center">ບໍ່ມີຂໍ້ມູນບໍລິສັດແນະນຳ</p>
        )}
      </div>
    </div>
  );
};

export default CompanySearch;