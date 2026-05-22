import axios from "axios";

const API = axios.create({
  baseURL: "https://mysitetrial.my.id/api",
});

////////////////////////////////////////////////////////////
// ✅ AUTO KIRIM TOKEN (REQUEST)
////////////////////////////////////////////////////////////
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

////////////////////////////////////////////////////////////
// ✅ HANDLE TOKEN EXPIRED (RESPONSE)
////////////////////////////////////////////////////////////
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ kalau token expired / unauthorized
    if (error.response?.status === 401) {
      console.log("🔒 Token expired / invalid");

      alert("Session habis, silakan login ulang 😃");

      // ✅ hapus token
      localStorage.removeItem("token");

      // ✅ redirect ke login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;