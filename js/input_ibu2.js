const API_URL = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";

/* ===== tanggal hari ini ===== */
(function(){
  const el = document.getElementById("tgl_bayar");
  if (el) el.value = new Date().toISOString().split("T")[0];
})();

/* ===== autocomplete ===== */
let master = [];

fetch(API_URL + "?master=master_ibu2")
  .then(r => r.json())
  .then(data => {
    master = data;
    const dl = document.getElementById("list_ibu2");
    dl.innerHTML = "";
    data.forEach(w => {
      const o = document.createElement("option");
      o.value = w.id_warga;
      o.label = w.nama;
      dl.appendChild(o);
    });
  })
  .catch(e => console.error("master ibu2 error", e));

document.getElementById("id_warga").addEventListener("input", e => {
  const f = master.find(x => x.id_warga == e.target.value);
  document.getElementById("nama").value = f ? f.nama : "";
  document.getElementById("dasawisma").value = f ? f.dasawisma : "";
});

/* ===== total ===== */
function hitung(){
  document.getElementById("total").value =
    Number(document.getElementById("rupiah_bayar").value || 0);
}
document.getElementById("rupiah_bayar").addEventListener("input", hitung);
hitung();

/* ===== history ===== */
function loadHistoryIbu2(){
  fetch(API_URL + "?history=ibu2")
    .then(r => r.json())
    .then(data => {
      const tb = document.getElementById("historyIbu2");
      tb.innerHTML = "";
      data.forEach(r => {
        tb.innerHTML += `
          <tr>
            <td>${r.nama}</td>
            <td>${new Date(r.bulan_bayar).toLocaleDateString("id-ID",{month:"long",year:"numeric"})}</td>
            <td class="text-end">${Number(r.total).toLocaleString("id-ID")}</td>
          </tr>`;
      });
    });
}
loadHistoryIbu2();

/* ===== submit ===== */
function sebelumSubmitIbu2(){
  hitung();
  document.getElementById("loadingOverlay").classList.remove("d-none");

  const iframe = document.querySelector("iframe");
  iframe.onload = function(){
    document.getElementById("loadingOverlay").classList.add("d-none");
    new bootstrap.Toast(document.getElementById("toastSuccess"),{delay:3000}).show();
    document.querySelector("form").reset();
    hitung();
    loadHistoryIbu2();
  };
  return true;
}
