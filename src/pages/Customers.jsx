import { useEffect, useState } from "react";
import API from "../services/api";

function Customers() {
  const [data, setData] = useState([]);
  const [packages, setPackages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    package_id: "",
    status: "active",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchPackages();
  }, []);

  const fetchCustomers = async () => {
    const res = await API.get("/customers");
    setData(res.data);
  };

  const fetchPackages = async () => {
    const res = await API.get("/packages");
    setPackages(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editId) {
      await API.put(`/customers/${editId}`, form);
    } else {
      await API.post("/customers", form);
    }

    setForm({
      name: "",
      address: "",
      phone: "",
      package_id: "",
      status: "active",
    });

    setEditId(null);
    fetchCustomers();
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      address: item.address,
      phone: item.phone,
      package_id: item.package_id,
      status: item.status || "active",
    });

    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus customer?")) return;
    await API.delete(`/customers/${id}`);
    fetchCustomers();
  };

  return (
    <>
      {/* ✅ FORM */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Edit Customer" : "Tambah Customer"}
        </h2>

        <div className="flex flex-wrap gap-3">
          <input
            name="name"
            placeholder="Nama"
            className="border p-2 rounded"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Alamat"
            className="border p-2 rounded"
            value={form.address}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="HP"
            className="border p-2 rounded"
            value={form.phone}
            onChange={handleChange}
          />

          <select
            name="package_id"
            className="border p-2 rounded"
            value={form.package_id}
            onChange={handleChange}
          >
            <option value="">Pilih Paket</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* ✅ STATUS DROPDOWN */}
          <select
            name="status"
            className="border p-2 rounded"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

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
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="p-2">Nama</th>
              <th>Alamat</th>
              <th>HP</th>
              <th>Paket</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t text-center">
                <td className="p-2">{item.name}</td>
                <td>{item.address}</td>
                <td>{item.phone}</td>

                <td>
                  {
                    packages.find((p) => p.id == item.package_id)
                      ?.name
                  }
                </td>

                {/* ✅ STATUS */}
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="flex gap-2 justify-center py-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
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

export default Customers;