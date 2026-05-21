import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportInvoicePDF = (invoice) => {
  const doc = new jsPDF();

  // ✅ HEADER
  doc.setFontSize(16);
  doc.text("INVOICE PEMBAYARAN WIFI", 120, 10);

  doc.setFontSize(12);
  doc.text("RT/RW Net", 10, 10);

  // ✅ FROM
  doc.text("Dari:", 10, 25);
  doc.text("RT/RW Net", 10, 32);
  doc.text("Phone: 08123456789", 10, 38);

  // ✅ KEPADA
  doc.text("Kepada:", 80, 25);
  doc.text(invoice.name, 80, 32);
  doc.text(`Phone: ${invoice.phone || "-"}`, 80, 38);

  // ✅ TAGIHAN
  doc.text("Tagihan:", 140, 25);
  doc.text(`No: ${invoice.id}`, 140, 32);
  doc.text(`Bulan: ${invoice.month}`, 140, 38);

  // ✅ TABLE
  autoTable(doc, {
    startY: 50,
    head: [["Produk", "Keterangan", "Qty", "Subtotal"]],
    body: [
      [
        invoice.package_name,
        `Internet ${invoice.package_name}`,
        "1",
        `Rp ${Number(invoice.amount).toLocaleString("id-ID")}`,
      ],
    ],
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // ✅ TOTAL
  doc.text("Total", 140, finalY);
  doc.text(
    `Rp ${Number(invoice.amount).toLocaleString("id-ID")}`,
    170,
    finalY
  );

  // ✅ STATUS
  doc.setFontSize(12);
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 10, finalY + 10);

  // ✅ KHUSUS UNPAID → TAMBAH PEMBAYARAN
  if (invoice.status !== "paid") {
    doc.setFontSize(12);
    doc.text("Pembayaran:", 10, finalY + 20);

    doc.text("Bank BCA", 10, finalY + 28);
    doc.text("No Rek: 1234567890", 10, finalY + 34);
    doc.text("A/N: RT RW NET", 10, finalY + 40);

    // ✅ QR CODE (STATIC IMAGE)
    doc.addImage(
      "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=PAYMENT_RT_RW",
      "PNG",
      150,
      finalY + 20,
      40,
      40
    );
  }

  // ✅ FOOTER
  doc.text("Terima kasih", 10, finalY + 60);

  doc.save(`invoice-${invoice.id}.pdf`);
};

// ✅ EXPORT REPORT (LAPORAN BULANAN)
export const exportReportPDF = (data, year, month) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("LAPORAN BULANAN RT/RW NET", 10, 10);

  doc.setFontSize(12);
  doc.text(`Tahun: ${year}`, 10, 20);
  doc.text(`Bulan: ${month || "Semua"}`, 10, 30);

  const tableData = data.map((item) => [
    item.id || "-",
    item.name || "-",
    item.package_name || "-",
    item.month || "-",
    `Rp ${Number(item.amount || 0).toLocaleString("id-ID")}`,
    item.status || "-",
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["ID", "Nama", "Paket", "Bulan", "Nominal", "Status"]],
    body: tableData,
  });

  doc.save(`laporan-${year}.pdf`);
};