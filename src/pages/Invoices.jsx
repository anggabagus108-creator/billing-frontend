import { useEffect, useState } from "react";
import API from "../services/api";

function Invoices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await API.get("/invoices");
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const sendWA = async (id) => {
    try {
      await API.post("/wa/invoice", { invoice_id: id });
      alert("✅ WA + PDF terkirim");
    } catch (err) {
      alert("❌ Gagal kirim WA");
    }
  };

  const downloadPDF = (id) => {
    window.open(`/api/invoices/pdf/${id}`, "_blank");
  };

  const handlePay = async (id, amount) => {
    if (!window.confirm("Yakin bayar?")) return;

    await API.post("/payments", {
      invoice_id: id,
      amount,
      method: "cash",
    });

    fetchInvoices();
  };

  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <>
      <div className="bg-white p-5 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Invoices</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nama</th>
              <th>Paket</th>
              <th>Nominal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t text-center">
                <td className="p-2">{item.name}</td>
                <td>{item.package_name}</td>
                <td>
                  Rp {Number(item.amount).toLocaleString("id-ID")}
                </td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.status === "paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="flex gap-2 justify-center py-2">
                  <button onClick={() => sendWA(item.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded">
                    WA
                  </button>

                  <button onClick={() => downloadPDF(item.id)}
                    className="bg-gray-500 text-white px-2 py-1 rounded">
                    PDF
                  </button>

                  <button onClick={() => handlePay(item.id, item.amount)}
                    className="bg-blue-500 text-white px-2 py-1 rounded">
                    Bayar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Invoices;