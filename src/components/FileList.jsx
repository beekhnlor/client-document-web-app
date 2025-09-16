import React, { useState, useEffect } from "react";
import apiClient from "../api/api";
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [fileToDelete, setFileToDelete] = useState(null);

  const fetchFiles = async () => {
    try {
      const response = await apiClient.get("/api/getupload");
      setFiles(Array.isArray(response.data) ? response.data : []);
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
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadStatus({ message: "ກະລຸນາເລືອກໄຟລ໌ກ່ອນ", type: "error" });
      return;
    }
    setIsUploading(true);
    setUploadStatus({ message: "ກຳລັງອັບໂຫຼດ...", type: "info" });
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("file", selectedFiles[i]);
    }
    try {
      await apiClient.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus({ message: "ອັບໂຫຼດສຳເລັດ!", type: "success" });
      setSelectedFiles(null);
      document.getElementById("file-input").value = null;
      await fetchFiles();
      setTimeout(() => setUploadStatus(""), 5000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus({
        message: "ອັບໂຫຼດບໍ່ສຳເລັດ. ກະລຸນາລອງໃໝ່.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // --- ฟังก์ชันใหม่ สำหรับตรวจสอบชนิดไฟล์ ---
  const getFileType = (filename) => {
    if (!filename) return "unknown";
    const extension = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) {
      return "pdf";
    }
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return "image";
    }
    return "other";
  };

  const baseUrl = import.meta.env.VITE_API_URL;

  const handleImageDownload = async (fileUrl, originalName) => {
    try {
      // 1. ใช้ fetch เพื่อดึงข้อมูลรูปภาพจาก Server มาเป็นข้อมูลดิบ (binary)
      const response = await fetch(fileUrl);
      const blob = await response.blob(); // 2. แปลงข้อมูลดิบให้เป็น Blob

      // 3. สร้าง URL ชั่วคราวสำหรับ Blob นี้ ซึ่งจะอยู่ในโดเมนเดียวกับหน้าเว็บ
      const objectUrl = window.URL.createObjectURL(blob);

      // 4. สร้างลิงก์ชั่วคราวแล้วสั่งให้คลิกเพื่อดาวน์โหลด
      const link = document.createElement("a");
      link.href = objectUrl;
      link.setAttribute("download", originalName || "image.jpg");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Could not download the image.", error);
    }
  };

  const handleImagePrint = (fileUrl) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      '<html><head><title>Print Image</title></head><body style="margin:0; text-align:center;">'
    );
    // คำสั่ง onload สำคัญมาก: รอให้รูปโหลดเสร็จก่อนค่อยสั่งพิมพ์
    printWindow.document.write(
      `<img src="${fileUrl}" style="max-width:100%;" onload="window.print(); window.close();" />`
    );
    printWindow.document.write("</body></html>");
    printWindow.document.close();
  };

  const handleDeleteClick = (file) => {
    Swal.fire({
      title: "ຢືນຢັນການລຶບ",
      html: `ທ່ານຕ້ອງການລຶບໄຟລ໌ <br/> <strong class="text-yellow-400">${
        file.original_name || file.files
      }</strong> <br/> ແທ້ບໍ່?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ຢືນຢັນ",
      cancelButtonText: "ຍົກເລີກ",
      background: "#1f2937", // Dark theme background
      color: "#ffffff", // Dark theme text color
    }).then((result) => {
      // ถ้าผู้ใช้กดยืนยัน
      if (result.isConfirmed) {
        // เรียกฟังก์ชัน confirmDelete เพื่อทำการลบจริงๆ
        confirmDelete(file);
      }
    });
  };

  const confirmDelete = async (fileToDelete) => {
    if (!fileToDelete) return;
    try {
      await apiClient.delete(`/api/file/${fileToDelete.id}`);

      // แสดงข้อความว่าลบสำเร็จ
      Swal.fire({
        title: "ລຶບສຳເລັດ!",
        text: `ໄຟລ໌ "${
          fileToDelete.original_name || fileToDelete.files
        }" ໄດ້ຖືກລຶບອອກຈາກລະບົບແລ້ວ.`,
        icon: "success",
        background: "#1f2937",
        color: "#ffffff",
        confirmButtonColor: "#3b82f6",
      });

      await fetchFiles(); // โหลดข้อมูลใหม่เพื่อให้ UI อัปเดต
    } catch (error) {
      console.error("Failed to delete file:", error);
      // แสดงข้อความว่าเกิดข้อผิดพลาด
      Swal.fire({
        title: "ເກີດຂໍ້ຜິດພາດ!",
        text: "ບໍ່ສາມາດລຶບໄຟລ໌ໄດ້. ກະລຸນາລອງໃໝ່.",
        icon: "error",
        background: "#1f2937",
        color: "#ffffff",
        confirmButtonColor: "#d33",
      });
    }
  };

  const cancelDelete = () => {
    setFileToDelete(null); // ปิด Modal
  };

  return (
    <div className="p-4 md:p-2 text-gray-200">
      <div className="mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white font-phetsarath">
          ອັບໂຫຼດໄຟລ໌
        </h2>
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
            <span className="font-phetsarath">
              {isUploading ? "ກຳລັງອັບໂຫຼດ..." : "ອັບໂຫຼດ"}
            </span>
          </button>
        </div>
        {uploadStatus && (
          <p
            className={`mt-3 text-sm font-phetsarath ${
              uploadStatus.type === "success"
                ? "text-green-400"
                : uploadStatus.type === "error"
                ? "text-red-400"
                : "text-gray-400"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {files.map((file) => {
              const fileType = getFileType(file.files);
              const fileUrl = `${baseUrl}/uploads/${file.files}`;

              // --- Refactor: สร้าง Header ของ Card ขึ้นมาก่อน เพื่อใช้ร่วมกัน ---
              const fileHeader = (
                <div className="p-3 bg-gray-700 text-gray-100 font-semibold border-b border-gray-600 flex justify-between items-center">
                  <h3 className="truncate font-phetsarath">
                    {file.original_name || file.files}
                  </h3>
                  <div className="flex items-center gap-3">
                    {/* ปุ่มสำหรับ Image เท่านั้น */}
                    {fileType === "image" && (
                      <>
                        <button
                          onClick={() =>
                            handleImageDownload(fileUrl, file.original_name)
                          }
                          className="text-gray-300 hover:text-white transition-colors"
                          title="Download"
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleImagePrint(fileUrl)}
                          className="text-gray-300 hover:text-white transition-colors"
                          title="Print"
                        >
                          <PrinterIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {/* ปุ่มลบ (มีสำหรับทุกไฟล์) */}
                    <button
                      onClick={() => handleDeleteClick(file)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );

              // ถ้าเป็น PDF ให้แสดงผลแบบเดิม
              if (fileType === "pdf") {
                return (
                  <div
                    key={file.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg flex flex-col h-[80vh]"
                  >
                    {fileHeader} {/* << ใช้ Header ที่สร้างไว้ */}
                    <div className="flex-grow">
                      <embed
                        src={fileUrl}
                        type="application/pdf"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                );
              }
              if (fileType === "image") {
                return (
                  <div
                    key={file.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg flex flex-col h-[80vh]"
                  >
                    {fileHeader} {/* << ใช้ Header ที่สร้างไว้ */}
                    <div className="flex-grow p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={fileUrl}
                        alt={file.original_name || "Uploaded Image"}
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
        <p className="text-center text-gray-500 py-10 font-phetsarath">
          ບໍ່ມີໄຟລ໌ໃຫ້ສະແດง. ກະລຸນາອັບໂຫຼດໄຟລ໌.
        </p>
      )}
    </div>
  );
};
export default FileList;
