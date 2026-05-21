import { useEffect, useState } from "react";
import API from "../services/api";

function WhatsApp() {
  const [qr, setQr] = useState(null);
  const [status, setStatus] = useState("disconnected");

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const qrRes = await API.get("/wa/qr");
      setQr(qrRes.data.qr);

      const statusRes = await API.get("/wa/status");
      setStatus(statusRes.data.status);

    } catch (err) {
      console.log(err);
    }
  };

  const getStatusUI = () => {
    switch (status) {
      case "connected":
        return (
          <p className="text-green-600 font-semibold">
            🟢 Connected
          </p>
        );
      case "connecting":
        return (
          <p className="text-yellow-500 font-semibold">
            🟡 Connecting...
          </p>
        );
      default:
        return (
          <p className="text-red-500 font-semibold">
            🔴 Disconnected
          </p>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">

      <h2 className="text-xl font-bold mb-4">
        WhatsApp Connection 📱
      </h2>

      {/* ✅ STATUS */}
      {getStatusUI()}

      {/* ✅ QR */}
      {qr && status !== "connected" ? (
        <img src={qr} alt="QR Code" className="mt-4 w-64" />
      ) : (
        <p className="mt-4">QR tidak tersedia</p>
      )}

    </div>
  );
}

export default WhatsApp;