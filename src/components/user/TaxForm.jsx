import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import laoEmblem from "../../assets/Emblem_of_Laos.svg.png";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // <-- จุดที่ 1: ลบออก
import apiClient from '../../api/api'; // <-- จุดที่ 1: เพิ่ม apiClient เข้ามาแทน
import "./print.css";
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

const CheckedBox = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block align-middle bg-blue-500 rounded-sm"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const UncheckedBox = () => (
  <div className="inline-block align-middle w-4 h-4 border-2 border-gray-600 rounded-sm"></div>
);

const DottedField = ({ children, className = "" }) => (
  <span
    className={`flex-grow border-b border-dotted border-gray-600 px-2 text-center font-bold ${className}`}
  >
    {children || <span className="opacity-0">.</span>}
  </span>
);

const TaxForm = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

   const printContainerRef = useRef(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // const response = await axios.get(`http://localhost:2025/api/document/${id}`); <-- โค้ดเก่า
        const response = await apiClient.get(`/api/document/${id}`); // <-- จุดที่ 2: แก้ไขการเรียกใช้
        
        // ผมเพิ่มการตรวจสอบข้อมูลที่ได้รับกลับมาให้เหมือนกับไฟล์ฟอร์มนะครับ
        const documentData = response.data.result || response.data.results || response.data;
        if (documentData) {
            setDoc(documentData);
        } else {
            setError("รูปแบบข้อมูลที่ได้รับจากเซิร์ฟเวอร์ไม่ถูกต้อง");
        }
      } catch (e) {
        setError("ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ: " + e.message);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    } else {
      setLoading(false);
      setError("ບໍ່ພົບ ID ໃນ URL.");
    }
  }, [id]);

  // ส่วนที่เหลือทั้งหมดเหมือนเดิมทุกประการ ไม่มีการเปลี่ยนแปลง
  // helper functions
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return null;
    return Number(num).toLocaleString("en-US");
  };

  //

    const handleDownloadPdf = () => {
    const input = printContainerRef.current; // เข้าถึง DOM element
    if (!input) return;

    html2canvas(input, {
        scale: 2, // เพิ่มความละเอียดของภาพที่แปลง 2 เท่า
        useCORS: true // สำหรับกรณีที่มีรูปภาพจากแหล่งอื่น
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // กำหนดขนาดของ PDF ให้เป็น A4
        const pdf = new jspdf({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        
        // คำนวณความสูงของรูปใน PDF ให้พอดีกับความกว้างของ A4
        const imgHeight = pdfWidth / ratio;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // กรณีที่เนื้อหายาวเกิน 1 หน้า A4 (เผื่อไว้)
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        // ตั้งชื่อไฟล์และสั่งดาวน์โหลด
        pdf.save(`document-${doc.id || 'download'}.pdf`);
    });
  };

  // สถานะโหลด
  if (loading)
    return (
      <div className="text-center p-10 font-phetsarath">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
    );
  if (error)
    return (
      <div className="text-center p-10 text-red-500 font-phetsarath">
        {error}
      </div>
    );
  if (!doc)
    return (
      <div className="text-center p-10 font-phetsarath">
        ບໍ່ພົບຂໍ້ມູນເອກະສານ.
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-phetsarath print-root">
      <div ref={printContainerRef}className="max-w-5xl mx-auto bg-white p-12 shadow-lg leading-relaxed print-container">
        <div className="text-center mb-6">
          <img
            src={laoEmblem}
            alt="Emblem of Laos"
            className="w-16 h-14 mx-auto mb-4"
          />
          <p className="font-bold">ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ</p>
          <p>ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນາຖາວອນ</p>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <p className="-ml-2">ຊື່ວິສາຫະກິດ</p>
            <p className="text-start">ໂທລະສັບ</p>
            <div className="w-36 h-12 border border-black mt-2 -ml-8"></div>
          </div>
          <div className="text-left flex-grow-0">
            <div className="flex items-end">
              <span>ເລກທີ:</span>
              <DottedField>{doc.number}</DottedField>
            </div>
            <div className="flex items-end mt-2">
              <span>ວັນທີ:</span>
              <DottedField>{formatDate(doc.created_at)}</DottedField>
            </div>
          </div>
        </div>

        <h1 className="text-center text-xl font-bold -mt-20">ໃບຄຳຮ້ອງ</h1>
        <div className="flex justify-center items-end text-xl py-2 w-2/3 pl-48">
          <span className="whitespace-nowrap font-bold text-base">
            ຂໍຢັ້ງຢືນການມອບພັນທະອາກອນ ປະຈຳປີ
          </span>
          <DottedField className="text-sm">{doc.year_of_form}</DottedField>
        </div>

        <div className="space-y-4">
          <div className="flex items-end pl-40 w-3/4">
            <span className="whitespace-nowrap mr-2 font-bold ">ຮຽນ:</span>
            <span>ທ່ານຫົວໜ້າກົມສ່ວຍສາອາກອນປະຈຳ</span>
            <DottedField className="text-sm">
              {doc.recipient_authority}
            </DottedField>
          </div>
          <div className="flex items-end pl-36 w-3/4">
            <span className="whitespace-nowrap mr-2 font-bold">ເລື່ອງ: </span>
            <span>ຂໍໃບຢັ້ງຢືນການມອບພັນທະອາກອນ ປະຈຳປີ</span>
            <DottedField className="text-sm">
              {doc.subject_of_request}
            </DottedField>
          </div>

          <div className="my-4 space-y-2 py-6 pl-12">
            <p>
              - ອີງຕາມ ກົດໝາຍວ່າດ້ວຍອາກອນລາຍໄດ້ ສະບັບເລກທີ 66/ສພຊ, ລົງວັນທີ 17
              ມິຖຸນາ 2019.
            </p>
            <p>
              - ອີງຕາມ ກົດໝາຍວ່າດ້ວຍອາກອນມູນຄ່າເພີ່ມ ສະບັບປັບປຸງ ເລກທີ 48/ສພຊ,
              ລົງວັນທີ 20 ກໍລະກົດ 2018.
            </p>
            <p>
              - ອີງຕາມ ບົດແນະນຳວ່າດ້ວຍການຄຸ້ມຄອງເກັບລາຍຮັບສ່ວຍສາອາກອນ ສະບັບເລກທີ
              3281/ກງ ລົງວັນທີ 06 ຕຸລາ 2014.
            </p>
          </div>
          <div className="flex items-end space-x-4">
            <div className="flex items-end flex-grow pl-12">
              <span>ຂ້າພະເຈົ້າທ່ານ</span>
              <DottedField>{doc.applicant_name}</DottedField>
            </div>
            <div className="flex items-end flex-grow ">
              <span>ສັນຊາດ:</span>
              <DottedField>{doc.nationality}</DottedField>
            </div>
          </div>

          <div className="flex items-end space-x-4 pl-12">
            <div className="flex items-end flex-grow-[2]">
              <span>☐ ໜັງສືຜ່ານແດນຫຼືບັດປະຈຳຕົວເລກທີ:</span>
              <DottedField>{doc.id_card_no}</DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>ລົງວັນທີ:</span>
              <DottedField>{formatDate(doc.id_issue_date)}</DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>ໂທລະສັບ:</span>
              <DottedField>{doc.applicant_tel}</DottedField>
            </div>
          </div>

          <div className="flex items-center flex-wrap pl-16">
            <span className="mr-2">Email:</span>
            <DottedField>{doc.applicant_email}</DottedField>
            <span className="mx-4">ຊີ່ງເປັນ:</span>
            <div className="flex items-center gap-2 mr-4">
              {doc.applicant_role === "ເຈົ້າຂອງວິສາຫະກິດ" ? (
                <CheckedBox />
              ) : (
                <UncheckedBox />
              )}
              <span>ເຈົ້າຂອງວິສາຫະກິດ,</span>
            </div>
            <div className="flex items-center gap-2 mr-4">
              {doc.applicant_role === "ຜູ້ຈັດການ" ? (
                <CheckedBox />
              ) : (
                <UncheckedBox />
              )}
              <span>ຜູ້ຈັດການ,</span>
            </div>
            <div className="flex items-center gap-2">
              {doc.applicant_role === "ຜู้ອຳນວຍການ" ? (
                <CheckedBox />
              ) : (
                <UncheckedBox />
              )}
              <span>ຜู้ອຳນວຍການ.</span>
            </div>
          </div>

          <div className="flex items-end">
            <span>- ຊື່ວິສາຫະກິດ:</span>
            <DottedField>{doc.organization_name}</DottedField>
          </div>

          <div className="flex items-end space-x-4">
            <div className="flex items-end flex-grow">
              <span>- ເລກທະບຽນວິສາຫະກິດ:</span>
              <DottedField>{doc.organization_id_no}</DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>ເລກປະຈຳຕົວຜູ້ເສຍອາກອນ:</span>
              <DottedField>{doc.taxpayer_id_no}</DottedField>
            </div>
          </div>

          <div className="flex items-end space-x-2">
            <span>- ສຳນັກງານຕັ້ງຢູ່:</span>
            <span>ເມືອງ</span>
            <DottedField>{doc.org_district}</DottedField>
            <span>ຖະໜົນ</span>
            <DottedField>{doc.org_street}</DottedField>
            <span>ບ້ານ</span>
            <DottedField>{doc.org_village}</DottedField>
            <span>ເມືອງ</span>
            <DottedField>{doc.org_district}</DottedField>
            <span>ແຂວງ</span>
            <DottedField>{doc.org_province}</DottedField>
          </div>

          <div className="flex items-end space-x-2">
            <span>- ທີ່ຕັ້ງໂຄງການ:</span>
            <span>ເມືອງ</span>
            <DottedField>{doc.proj_district}</DottedField>
            <span>ຖະໜົນ</span>
            <DottedField>{doc.proj_street}</DottedField>
            <span>ບ້ານ</span>
            <DottedField>{doc.proj_village}</DottedField>
            <span>ເມືອງ</span>
            <DottedField>{doc.proj_district}</DottedField>
            <span>ແຂວງ</span>
            <DottedField>{doc.proj_province}</DottedField>
          </div>

          <div className="flex items-end space-x-4">
            <div className="flex items-end flex-grow">
              <span>- ໂທລະສັບຕັ້ງໂຕະ:</span>
              <DottedField>{doc.organization_tel}</DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>ມືຖື:</span>
              <DottedField>{doc.organization_mobile}</DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>Fax:</span>
              <DottedField>{doc.fax}</DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>ຕູ້ໄປສະນີ:</span>
              <DottedField>{doc.organization_pobox}</DottedField>
            </div>
          </div>

          <div className="flex items-end space-x-4">
            <div className="flex items-end flex-grow">
              <span>- Email:</span>
              <DottedField>{doc.organization_email}</DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>website:</span>
              <DottedField>{doc.website}</DottedField>
            </div>
          </div>

          <div className="flex items-end">
            <span>- ຂະແໜງວິຊາຊີບຕົ້ນຕໍ:</span>
            <DottedField>{doc.primary_profession}</DottedField>
          </div>

          <div className="flex items-end">
            <span>- ຂະແໜງວິຊາຊີບສຳຮອງ:</span>
            <DottedField>{doc.secondary_profession}</DottedField>
          </div>

          <div className="flex items-end space-x-4">
            <div className="flex items-end flex-grow-[2]">
              <span>- ຊື່ແລະນາມສະກຸນຫົວໜ້າບັນຊີ:</span>
              <DottedField>{doc.accountant_name}</DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>ໂທລະສັບ:</span>
              <DottedField>{doc.accountant_contact}</DottedField>
            </div>
          </div>

          <div className="flex items-end flex-grow">
            <span>- Email:</span>
            <DottedField>{doc.accountant_email}</DottedField>
          </div>

          <div className="flex items-end">
            <span>- ຊື່ບໍລິສັດທີ່ຈ້າງເຮັດບັນຊີ:</span>
            <DottedField>{doc.consultant_name}</DottedField>
          </div>

          <div className="flex items-end space-x-4">
            <div className="flex items-end flex-grow">
              <span>- ສັນຍາວ່າຈ້າງທີ່ປືກສາບັນຊີເລກທີ</span>
              <DottedField>{doc.consultant_contract_no}</DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>ລົງວັນທີ</span>
              <DottedField>
                {formatDate(doc.consultant_contract_date)}
              </DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>ມູນຄ່າສັນຍາ</span>
              <DottedField>
                {formatNumber(doc.consultant_contract_value)}
              </DottedField>
              <span>ກີບ/ເດືອນ</span>
            </div>
          </div>

          <div className="flex items-end space-x-4 ">
            <div className="flex items-end flex-grow">
              <span>- ໂທລະສັບ:</span>
              <DottedField>{doc.consultant_tel}</DottedField>
            </div>
            <div className="flex items-end flex-grow">
              <span>email:</span>
              <DottedField>{doc.consultant_email}</DottedField>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto text-center no-print py-4 flex justify-center gap-4">
        {/* ปุ่มดาวน์โหลด */}
     {/* ปุ่มปริ้น (ปุ่มดาวน์โหลดเดิม) */}
        <button
          onClick={() => window.print()}
          disabled={loading || !doc}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          ພິມ
        </button>

      <button
          onClick={handleDownloadPdf}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          ດາວໂຫຼດ PDF
        </button>
        
    
        <button
          onClick={() => navigate("/documents")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300"
        >
          ຍ້ອນກັບ
        </button>
      </div>
    </div>
  );
};

export default TaxForm;