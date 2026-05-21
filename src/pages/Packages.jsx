import { useEffect, useState } from "react";
import API from "../services/api";

function Packages() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    speed: "",
    price: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const res = await API.get("/packages");
    setData(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editId) {
      await API.put(`/packages/${editId}`, form);
    } else {
      await API.post("/packages", form);
    }

    setForm({ name: "", speed: "", price: "" });
    setEditId(null);
    fetchPackages();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus paket?")) return;
    await API.delete(`/packages/${id}`);
    fetchPackages();
  };

  return (
    <>

      {/* ✅ FORM */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Edit Paket" : "Tambah Paket"}
        </h2>

        <div className="flex gap-3 flex-wrap">
          <input name="name" placeholder="Nama"
            className="border p-2 rounded"
            value={form.name} onChange={handleChange} />

          <input name="speed" placeholder="Speed"
            className="border p-2 rounded"
            value={form.speed} onChange={handleChange} />

          <input name="price" placeholder="Harga"
            className="border p-2 rounded"
            value={form.price} onChange={handleChange} />

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Simpan"}
          </button>
        </div>
      </div>

      {/* ✅ TABLE */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nama</th>
              <th>Speed</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.name}</td>
                <td>{item.speed}</td>
                <td className="text-green-600 font-semibold">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </td>

                <td className="flex justify-center gap-2 py-2">
                  <button onClick={() => handleEdit(item)}
                    className="bg-yellow-400 px-2 py-1 rounded">
                    Edit
                  </button>

                  <button onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded">
                    Hapus
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

export default Packages;