const API = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";

function simpan() {
  const data = {
    type: "kas",
    tanggal: tgl.value,
    bulan: bulan.value,
    deskripsi: desc.value,
    jenis: jenis.value,
    pengeluaran: keluar.value || 0,
    pemasukan: masuk.value || 0,
    keterangan: ket.value
  };

  fetch(API, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(res => {
    alert(res.status === "OK"
      ? "✅ Data kas berhasil disimpan"
      : "❌ Gagal menyimpan");
  });
}
