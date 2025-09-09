import React, { useState, useEffect } from "react";
// import axios from "axios"; // <-- จุดที่ 1: ลบออก
import apiClient from '../../api/api'; // <-- จุดที่ 1: เพิ่ม apiClient เข้ามาแทน
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

// ค่าเริ่มต้นของฟอร์มสำหรับใช้ในการสร้างและรีเซ็ต (ส่วนนี้เหมือนเดิม)
const initialFormState = {
  year_of_form: new Date().getFullYear(),
  number: "",
  recipient_authority: "",
  subject_of_request: "",
  applicant_name: "",
  nationality: "",
  id_card_no: "",
  id_issue_date: "",
  applicant_tel: "",
  applicant_email: "",
  applicant_role: "",
  organization_name: "",
  organization_id_no: "",
  taxpayer_id_no: "",
  org_house_no: "",
  org_street: "",
  org_unit: "",
  org_village: "",
  org_district: "",
  org_province: "",
  proj_house_no: "",
  proj_street: "",
  proj_unit: "",
  proj_village: "",
  proj_district: "",
  proj_province: "",
  organization_tel: "",
  organization_mobile: "",
  fax: "",
  organization_pobox: "",
  organization_email: "",
  website: "",
  primary_profession: "",
  secondary_profession: "",
  accountant_name: "",
  accountant_contact: "",
  accountant_email: "",
  consultant_name: "",
  consultant_contract_no: "",
  consultant_contract_date: "",
  consultant_contract_value: "",
  consultant_tel: "",
  consultant_email: "",
};

const LaoApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      return new Date(dateString).toISOString().split("T")[0];
    };

    if (isEditMode) {
      // axios.get(`http://localhost:2025/api/document/${id}`) <-- โค้ดเก่า
      apiClient.get(`/api/document/${id}`) // <-- จุดที่ 2: แก้ไขการเรียกใช้
        .then((response) => {
          // ผมสังเกตว่า API ของคุณอาจจะไม่ได้ส่งข้อมูลกลับมาใน key 'result' เสมอไป
          // ผมจะปรับให้มันฉลาดขึ้นนิดหน่อยครับ
          const documentData = response.data.result || response.data.results || response.data;
          
          if (documentData) {
              documentData.id_issue_date = formatDateForInput(
                documentData.id_issue_date
              );
              documentData.consultant_contract_date = formatDateForInput(
                documentData.consultant_contract_date
              );
              setFormData(documentData);
          } else {
              toast.error("รูปแบบข้อมูลที่ได้รับจากเซิร์ฟเวอร์ไม่ถูกต้อง");
              navigate("/documents");
          }
        })
        .catch((err) => {
          toast.error("ບໍ່ສາມາດດຶງຂໍ້ມູນที่จะແກ້ໄຂໄດ້");
          navigate("/documents");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, isEditMode, navigate]);
  
  // ส่วนของ validateForm และ handleChange เหมือนเดิมทุกประการ ไม่มีการเปลี่ยนแปลง
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+()-\s]+$/;

    if (!formData.applicant_name.trim())
      newErrors.applicant_name = "ກະລຸນາປ້ອນຊື່ຜູ້ຍື່ນຄຳຮ້ອງ";
    if (!formData.id_card_no.trim())
      newErrors.id_card_no = "ກະລຸນາປ້ອນເລກບັດປະຈຳຕົວ";
    if (!formData.organization_name.trim())
      newErrors.organization_name = "ກະລຸນາປ້ອນຊື່ວິສາຫະກິດ";
    if (!formData.taxpayer_id_no.trim())
      newErrors.taxpayer_id_no = "ກະລຸນາປ້ອນເລກປະຈຳຕົວຜູ້ເສຍອາກອນ";

    if (formData.applicant_email && !emailRegex.test(formData.applicant_email))
      newErrors.applicant_email = "ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ";
    if (formData.applicant_tel && !phoneRegex.test(formData.applicant_tel))
      newErrors.applicant_tel = "ກະລຸນາປ້ອນສະເພາະຕົວເລກ";
    if (
      formData.organization_email &&
      !emailRegex.test(formData.organization_email)
    )
      newErrors.organization_email = "ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ";
    if (
      formData.organization_tel &&
      !phoneRegex.test(formData.organization_tel)
    )
      newErrors.organization_tel = "ກະລຸນາປ້ອນສະເພາະຕົວເລກ";
    if (
      formData.organization_mobile &&
      !phoneRegex.test(formData.organization_mobile)
    )
      newErrors.organization_mobile = "ກະລຸນາປ້ອນສະເພາະຕົວເລກ";
    if (
      formData.accountant_email &&
      !emailRegex.test(formData.accountant_email)
    )
      newErrors.accountant_email = "ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ";
    if (
      formData.accountant_contact &&
      !phoneRegex.test(formData.accountant_contact)
    )
      newErrors.accountant_contact = "ກະລຸນາປ້ອນສະເພາະຕົວເລກ";
    if (
      formData.consultant_email &&
      !emailRegex.test(formData.consultant_email)
    )
      newErrors.consultant_email = "ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ";
    if (formData.consultant_tel && !phoneRegex.test(formData.consultant_tel))
      newErrors.consultant_tel = "ກະລຸນາປ້ອນສະເພາະຕົວເລກ";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FINAL DATA TO SUBMIT:", formData);
    console.log("Value of proj_province:", formData.proj_province);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.warn("ກະລຸນາກວດສອບຂໍ້ມູນໃຫ້ຖືກຕ້ອງ");
      return;
    }

    try {
      if (isEditMode) {
        // const response = await axios.put(`http://localhost:2025/api/document/${id}`, formData); <-- โค้ดเก่า
        const response = await apiClient.put(`/api/document/${id}`, formData); // <-- จุดที่ 3: แก้ไขการเรียกใช้
        toast.success(response.data.message || "ອັບເດດຂໍ້ມູນສຳເລັດ");
        navigate("/documents");
      } else {
        // const response = await axios.post("http://localhost:2025/api/document", formData); <-- โค้ดเก่า
        const response = await apiClient.post("/api/document", formData); // <-- จุดที่ 4: แก้ไขการเรียกใช้
        toast.success(response.data.message || "ບັນທືກຂໍ້ມູນສຳເລັດ");
        setFormData(initialFormState);
        setErrors({});
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "ເກີດຂໍຜິດພາດ";
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
    }
  };

  // ส่วนของ JSX ด้านล่างนี้เหมือนเดิมทุกประการ ไม่มีการเปลี่ยนแปลง
  if (isLoading) {
    return (
      <div className="text-center p-10 font-phetsarath">
        ກຳລັງໂຫຼດຂໍ້ມູນສຳລັບແກ້ໄຂ...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-8 font-phetsarath">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditMode ? "ແກ້ໄຂໃບຄຳຮ້ອງ" : "ໃບຄຳຮ້ອງ"}
          </h1>
          <h2 className="text-xl text-gray-600 mt-2">
            ຂໍໃບຢັ້ງຢືນການມອບພັນທະອາກອນ
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b pb-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label
                  htmlFor="year_of_form"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  ປະຈຳປີ
                </label>
                <input
                  type="number"
                  id="year_of_form"
                  name="year_of_form"
                  value={formData.year_of_form}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  ເລກທີ
                </label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* --- แถวที่ 2 --- */}
              {/* ຮຽນ: ... */}
              <div className="md:col-span-2">
                {" "}
                {/* ให้ช่องนี้ยาวเต็มแถว */}
                <label
                  htmlFor="recipient_authority"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  ຮຽນ: ທ່ານຫົວໜ້າສ່ວຍສາອາກອນປະຈຳ
                </label>
                <input
                  type="text"
                  id="recipient_authority"
                  name="recipient_authority"
                  value={formData.recipient_authority}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="subject_of_request"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  ເລື່ອງ: ຂໍໃບຢັ້ງຢືນການມອບພັນທະອາກອນປະຈຳປີ
                </label>
                <input
                  type="text"
                  id="subject_of_request"
                  name="subject_of_request"
                  value={formData.subject_of_request}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ຂ້າພະເຈົ້າທ່ານ
                </label>
                <input
                  type="text"
                  name="applicant_name"
                  value={formData.applicant_name}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.applicant_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.applicant_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.applicant_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">ສັນຊາດ</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ຖືໜັງສືຜ່ານແດນ/ບັດປະຈຳຕົວເລກທີ່
                </label>
                <input
                  type="text"
                  name="id_card_no"
                  value={formData.id_card_no}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.id_card_no ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.id_card_no && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.id_card_no}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ລົງວັນທີ
                </label>
                <input
                  type="date"
                  name="id_issue_date"
                  value={formData.id_issue_date}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ໂທລະສັບ
                </label>
                <input
                  type="text"
                  name="applicant_tel"
                  value={formData.applicant_tel}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.applicant_tel ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.applicant_tel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.applicant_tel}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">Email</label>
                <input
                  type="text"
                  name="applicant_email"
                  value={formData.applicant_email}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.applicant_email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.applicant_email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.applicant_email}
                  </p>
                )}
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="mb-2 font-medium text-gray-600">ຕຳແໜ່ງ</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="applicant_role"
                      value="ເຈົ້າຂອງວິສາຫະກິດ"
                      checked={formData.applicant_role === "ເຈົ້າຂອງວິສາຫະກິດ"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    ເຈົ້າຂອງວິສາຫະກິດ
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="applicant_role"
                      value="ຜູ້ຈັດການ"
                      checked={formData.applicant_role === "ຜູ້ຈັດການ"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    ຜູ້ຈັດການ
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="applicant_role"
                      value="ຜู้ອຳນວຍການ"
                      checked={formData.applicant_role === "ຜู้ອຳນວຍການ"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    ຜู้ອຳນວຍການ
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section: ຂໍ້ມູນວິສາຫະກິດ */}
          <div className="border-b pb-6">
            {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">2. ຂໍ້ມູນຫົວໜ່ວຍທຸລະກິດ</h3> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 font-medium text-gray-600">
                  ຊື່ວິສາຫະກິດ
                </label>
                <input
                  type="text"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.organization_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.organization_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.organization_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ເລກປະຈຳຕົວວິສາຫະກິດ
                </label>
                <input
                  type="text"
                  name="organization_id_no"
                  value={formData.organization_id_no}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ເລກປະຈຳຕົວຜູ້ເສຍອາກອນ
                </label>
                <input
                  type="text"
                  name="taxpayer_id_no"
                  value={formData.taxpayer_id_no}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.taxpayer_id_no ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.taxpayer_id_no && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.taxpayer_id_no}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-gray-600">
                  ສຳນັກງານຕັ້ງຢູ່
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ເຮືອນເລກທີ</label>
                    <input
                      type="text"
                      name="org_house_no"
                      value={formData.org_house_no}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ໜ່ວຍ</label>
                    <input
                      type="text"
                      name="org_unit"
                      value={formData.org_unit}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ຖະໜົນ</label>
                    <input
                      type="text"
                      name="org_street"
                      value={formData.org_street}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ບ້ານ</label>
                    <input
                      type="text"
                      name="org_village"
                      value={formData.org_village}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ເມືອງ</label>
                    <input
                      type="text"
                      name="org_district"
                      value={formData.org_district}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ແຂວງ</label>
                    <input
                      type="text"
                      name="org_province"
                      value={formData.org_province}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-gray-600">
                  ທີ່ຕັ້ງໂຄງການ
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ເຮືອນເລກທີ</label>
                    <input
                      type="text"
                      name="proj_house_no"
                      value={formData.proj_house_no}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ໜ່ວຍ</label>
                    <input
                      type="text"
                      name="proj_unit"
                      value={formData.proj_unit}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ຖະໜົນ</label>
                    <input
                      type="text"
                      name="proj_street"
                      value={formData.proj_street}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ບ້ານ</label>
                    <input
                      type="text"
                      name="proj_village"
                      value={formData.proj_village}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ເມືອງ</label>
                    <input
                      type="text"
                      name="proj_district"
                      value={formData.proj_district}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ແຂວງ</label>
                    <input
                      type="text"
                      name="proj_province"
                      value={formData.proj_province}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ໂທລະສັບຕັ້ງໂຕະ
                </label>
                <input
                  type="text"
                  name="organization_tel"
                  value={formData.organization_tel}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.organization_tel
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.organization_tel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.organization_tel}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">ມືຖື</label>
                <input
                  type="text"
                  name="organization_mobile"
                  value={formData.organization_mobile}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.organization_mobile
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.organization_mobile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.organization_mobile}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">Fax</label>
                <input
                  type="text"
                  name="fax"
                  value={formData.fax}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ຕູ້ໄປສະນີ
                </label>
                <input
                  type="text"
                  name="organization_pobox"
                  value={formData.organization_pobox}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">Email</label>
                <input
                  type="text"
                  name="organization_email"
                  value={formData.organization_email}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.organization_email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.organization_email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.organization_email}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section: ຂໍ້ມູນເພີ່ມເຕີມ */}
          <div>
            {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">3. ຂໍ້ມູນເພີ່ມເຕີມ</h3> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ຂະແໜ່ງວິຊາຊີບຕົ້ນຕໍ
                </label>
                <input
                  type="text"
                  name="primary_profession"
                  value={formData.primary_profession}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ຂະແໜ່ງວິຊາຊີບສຳຮອງ
                </label>
                <input
                  type="text"
                  name="secondary_profession"
                  value={formData.secondary_profession}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 font-medium text-gray-600">
                  ຊື່ ແລະ ນາມສະກຸນ ຫົວໜ້າບັນຊີ
                </label>
                <input
                  type="text"
                  name="accountant_name"
                  value={formData.accountant_name}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ໂທລະສັບ (ຫົວໜ້າບັນຊີ)
                </label>
                <input
                  type="text"
                  name="accountant_contact"
                  value={formData.accountant_contact}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.accountant_contact
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.accountant_contact && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.accountant_contact}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  Email (ຫົວໜ້າບັນຊີ)
                </label>
                <input
                  type="text"
                  name="accountant_email"
                  value={formData.accountant_email}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.accountant_email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.accountant_email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.accountant_email}
                  </p>
                )}
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 font-medium text-gray-600">
                  ຊື່ບຸກຄົນ/ນິຕິບຸກຄົນທີ່ໃຫ້ຄຳປຶກສາ
                </label>
                <input
                  type="text"
                  name="consultant_name"
                  value={formData.consultant_name}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ສັນຍາວ່າຈ້າງທີ່ປຶກສາບັນຊີເລກທີ
                </label>
                <input
                  type="text"
                  name="consultant_contract_no"
                  value={formData.consultant_contract_no}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ລົງວັນທີ (ສັນຍາ)
                </label>
                <input
                  type="date"
                  name="consultant_contract_date"
                  value={formData.consultant_contract_date}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ມູນຄ່າສັນຍາ
                </label>
                <input
                  type="number"
                  name="consultant_contract_value"
                  value={formData.consultant_contract_value}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  ໂທລະສັບ (ທີ່ປຶກສາ)
                </label>
                <input
                  type="text"
                  name="consultant_tel"
                  value={formData.consultant_tel}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.consultant_tel ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.consultant_tel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.consultant_tel}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-600">
                  Email (ທີ່ປຶກສາ)
                </label>
                <input
                  type="text"
                  name="consultant_email"
                  value={formData.consultant_email}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg ${
                    errors.consultant_email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.consultant_email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.consultant_email}
                  </p>
                )}
              </div>
            </div>
          </div>

         <div className="pt-6 max-w-5xl mx-auto text-center no-print py-4 flex justify-center gap-4">
            <button
              type="submit"
              className="w-1/3 py-3 px-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all text-lg font-semibold"
            >
              {isEditMode ? "ອັບເດດຂໍ້ມູນ" : "ບັນທຶກຂໍ້ມູນ"}
            </button>
           <button
              type="button"
              onClick={() => navigate(isEditMode ? "/documents" : "/")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 w-1/3"
            >
              ຍ້ອນກັບ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaoApplicationForm;