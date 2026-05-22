import { useEffect, useState } from "react";
import API from "../services/api";

function Invoices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [month, setMonth] = useState("");
  const [dueDate, setDueDate] = useState("");

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [page, setPage] = useState(1);
  
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const limit = 25;
  const startNo = (page - 1) * limit;


  useEffect(() => {
    fetchInvoices();

    // ✅ auto isi bulan sekarang
    const now = new Date().toISOString().slice(0, 7);
    setMonth(now);
  }, [page]);

  const fetchInvoices = async () => {
  try {
    const res = await API.get(`/invoices?page=${page}&limit=${limit}`);
    
    setData(res.data.data);          // ✅ data
    setTotalData(res.data.total);    // ✅ total

    const pages = Math.ceil(res.data.total / limit);
    setTotalPages(pages);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  // ✅ GENERATE INVOICE
  const handleGenerate = async () => {
    if (!month || !dueDate) {
      alert("❌ Isi bulan & tanggal jatuh tempo");
      return;
    }

    try {
      await API.post("/invoices/generate", {
        month,
        due_date: dueDate,
      });

      alert("✅ Invoice berhasil dibuat");
      fetchInvoices();
    } catch (err) {
      alert("❌ Gagal generate");
    }
  };

  // ✅ FIX WA (SEMUA LOGIC DI BACKEND)
  const sendWA = async (item) => {
    try {
      await API.post("/wa/invoice", {
        invoice_id: item.id,
      });

      if (item.status === "paid") {
        alert("✅ WA terima kasih terkirim");
      } else {
        alert("✅ Invoice + WA terkirim");
      }
    } catch (err) {
      console.log(err);
      alert("❌ Gagal kirim WA");
    }
  };

  // ✅ FIX PDF (TIDAK PAKAI LOCALHOST)
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
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Invoices</h2>

      {/* ✅ INFO FORMAT */}
      <span className="text-xs text-gray-500">
        Format: YYYY-MM (contoh: 2026-05)
      </span>

      {/* ✅ FORM */}
      <div className="flex gap-2 mb-4 mt-1">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={handleGenerate}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Generate
        </button>
      </div>

      {/* ✅ TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Bulan</th>
            <th>Paket</th>
            <th>Nominal</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => {
            const isCurrent = item.month === currentMonth;
            const isOverdue =
              item.status !== "paid" && item.month < currentMonth;

            return (
              <tr key={item.id} className="border-t text-center">
                <td>{startNo + index + 1}</td>
                <td className="p-2">{item.name}</td>

                {/* ✅ BULAN */}
                <td>
                  {new Date(item.month + "-01").toLocaleString(
                    "id-ID",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}

                  {isCurrent && (
                    <span className="ml-2 text-green-500 text-xs">
                      (Bulan Ini)
                    </span>
                  )}

                  {isOverdue && (
                    <span className="ml-2 text-red-500 text-xs">
                      (Tunggakan)
                    </span>
                  )}
                </td>

                <td>{item.package_name}</td>

                <td>
                  Rp {Number(item.amount).toLocaleString("id-ID")}
                </td>

                {/* ✅ STATUS */}
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.status === "paid"
                        ? "bg-green-100 text-green-600"
                        : isOverdue
                        ? "bg-red-200 text-red-700"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {item.status === "paid"
                      ? "Lunas"
                      : isOverdue
                      ? "Tunggakan"
                      : "Belum Bayar"}
                  </span>
                </td>

                {/* ✅ AKSI */}
                <td className="flex gap-2 justify-center py-2">
                  <button
                    onClick={() => sendWA(item)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    WA
                  </button>

                  <button
                    onClick={() => downloadPDF(item.id)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    PDF
                  </button>

                  {/* ✅ HILANGKAN BAYAR JIKA PAID */}
                  {item.status !== "paid" && (
                    <button
                      onClick={() =>
                        handlePay(item.id, item.amount)
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Bayar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-col items-center mt-5 gap-2">

  {/* ✅ INFO */}
  <div>
    Halaman <b>{page}</b> dari <b>{totalPages}</b> | 
    Total Data: <b>{totalData}</b>
  </div>

  {/* ✅ BUTTON */}
  <div className="flex gap-2">
    <button
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
      className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
    >
      Prev
    </button>

    <button
      onClick={() => setPage(page + 1)}
      disabled={page === totalPages}
      className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>

  {/* ✅ JUMP PAGE */}
  <div className="flex gap-2 items-center">
    <span>Pindah ke:</span>
    <input
      type="number"
      min="1"
      max={totalPages}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          let val = Number(e.target.value);
          if (val >= 1 && val <= totalPages) {
            setPage(val);
          }
        }
      }}
      className="border p-1 w-20 text-center"
    />
  </div>

</div>
    </div>
  );
}

export default Invoices;