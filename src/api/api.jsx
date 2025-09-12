import axios from 'axios';

// 1. ดึงค่า URL ออกมาเก็บในตัวแปรธรรมดาก่อน
const API_BASE_URL = import.meta.env.VITE_API_URL;

// 2. ตรวจสอบว่าเราได้ค่ามาจริงๆ หรือไม่ (สำคัญมาก!)
if (!API_BASE_URL) {
  console.error("VITE_API_URL is not defined! Please check your .env file or environment variables.");
}

const apiClient = axios.create({
  // 3. ใช้ตัวแปรนี้ในการตั้งค่า baseURL
  baseURL: API_BASE_URL,
});

// (Optional) เพิ่ม Interceptor เพื่อดูว่า Request ที่ส่งออกไปมีหน้าตาเป็นอย่างไร
// เหมาะสำหรับ Debugging
apiClient.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});

export default apiClient;