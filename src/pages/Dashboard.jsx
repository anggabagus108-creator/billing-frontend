import { useEffect, useState } from "react";
import API from "../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState({
    income: 0,
    customer: 0,
    unpaid: 0,
    chart: [],
  });

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState("");

  // ✅ FETCH DATA
  useEffect(() => {
    fetchDashboard();
  }, [year, month]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get(
        `/dashboard?year=${year}&month=${month}`
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ DOWNLOAD REPORT PDF
  const downloadReport = () => {
  window.open(
    `/api/dashboard/report?year=${year}&month=${month}`,
    "_blank"
  );
};


  // ✅ LIST TAHUN
  const getYears = () => {
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  return (
    <>
      {/* ✅ HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">
          Dashboard Overview 📊
        </h1>

        <div className="flex gap-3 items-center">

          {/* ✅ TAHUN */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded"
          >
            {getYears().map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* ✅ BULAN */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Semua Bulan</option>
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3">Mar</option>
            <option value="4">Apr</option>
            <option value="5">Mei</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Agu</option>
            <option value="9">Sep</option>
            <option value="10">Okt</option>
            <option value="11">Nov</option>
            <option value="12">Des</option>
          </select>

          {/* ✅ DOWNLOAD BUTTON */}
          <button
            onClick={downloadReport}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>

        </div>
      </div>

      {/* ✅ CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500 text-sm">Total Income</h3>
          <p className="text-2xl font-bold text-green-500">
            Rp {Number(data.income).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500 text-sm">Customers</h3>
          <p className="text-2xl font-bold">
            {data.customer}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500 text-sm">Unpaid</h3>
          <p className="text-2xl font-bold text-red-500">
            {data.unpaid}
          </p>
        </div>
      </div>

      {/* ✅ CHART */}
      <div className="bg-white p-5 rounded shadow">
        <h3 className="font-semibold mb-4">
          Income Chart ({year} {month && `- ${month}`})
        </h3>

        {data.chart.length === 0 ? (
          <p className="text-center">Belum ada data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.chart}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(val) =>
                  `Rp ${Number(val).toLocaleString("id-ID")}`
                }
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
}

export default Dashboard;