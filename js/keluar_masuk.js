const API_URL = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";

/* ===== tanggal hari ini ===== */
(function(){
  const el = document.getElementById("tanggal");
  if (el) el.value = new Date().toISOString().split("T")[0];
})();

/* ===== master jenis ===== */
fetch(API_URL + "?master=master_keluar_masuk")
  .then(r => r.json())
  .then(data => {
    const s = document.getElementById("jenis");
    s.innerHTML = '<option value="">-- pilih --</option>';
    data.forEach(x=>{
      const o = document.createElement("option");
      o.value = x.jenis;
      o.textContent = x.jenis;
      s.appendChild(o);
    });
  });

/* ===== history ===== */
function loadHistoryKM(){
  fetch(API_URL + "?history=keluar_masuk")
    .then(r => r.json())
    .then(data => {
      const tb = document.getElementById("historyKM");
      tb.innerHTML = "";
      data.forEach(r => {
        tb.innerHTML += `
          <tr>
            <td>${r.tanggal}</td>
            <td>${r.deskripsi}</td>
            <td class="text-end">${Number(r.pemasukan).toLocaleString("id-ID")}</td>
            <td class="text-end">${Number(r.pengeluaran).toLocaleString("id-ID")}</td>
          </tr>`;
      });
    });
}
loadHistoryKM();

/* ===== submit ===== */
function sebelumSubmitKM(){
  document.getElementById("loadingOverlay").classList.remove("d-none");

  const iframe = document.querySelector("iframe");
  iframe.onload = function(){
    document.getElementById("loadingOverlay").classList.add("d-none");
    new bootstrap.Toast(document.getElementById("toastSuccess"),{delay:3000}).show();
    document.querySelector("form").reset();
    loadHistoryKM();
  };
  return true;
}
