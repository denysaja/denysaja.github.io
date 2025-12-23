const API_URL = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";

/* ===============================
   SET TANGGAL HARI INI
================================ */
(function(){
  const el = document.getElementById("tgl_bayar");
  if (el) el.value = new Date().toISOString().split("T")[0];
})();

/* ===============================
   AUTOCOMPLETE
================================ */
let master = [];

fetch(API_URL + "?master=master_warga")
  .then(r => r.json())
  .then(data => {
    master = data;
    const dl = document.getElementById("list_warga");
    dl.innerHTML = "";
    data.forEach(w => {
      const o = document.createElement("option");
      o.value = w.id_warga;
      o.label = w.nama;
      dl.appendChild(o);
    });
  })
  .catch(e => console.error("master error", e));

document.getElementById("id_warga").addEventListener("input", e => {
  const f = master.find(x => x.id_warga == e.target.value);
  document.getElementById("nama").value = f ? f.nama : "";
});

/* ===============================
   TOTAL
================================ */
function hitung() {
  let t = 0;
  document.querySelectorAll(".hitung").forEach(i => t += Number(i.value || 0));
  document.getElementById("total").value = t;
}
document.querySelectorAll(".hitung").forEach(i => i.addEventListener("input", hitung));
hitung();

/* ===============================
   HISTORY
================================ */
function loadHistory() {
  fetch(API_URL + "?history=warga")
    .then(r => r.json())
    .then(data => {
      const tb = document.getElementById("history");
      tb.innerHTML = "";
      data.forEach(r => {
        tb.innerHTML += `
          <tr>
            <td>${r.nama}</td>
            <td>${new Date(r.bulan_dibayar).toLocaleDateString("id-ID",{month:"long",year:"numeric"})}</td>
            <td class="text-end">${Number(r.total).toLocaleString("id-ID")}</td>
          </tr>`;
      });
    })
    .catch(e => console.error("history error", e));
}

loadHistory();

/* ===============================
   SUBMIT
================================ */
function sebelumSubmit() {
  hitung();

  const iframe = document.querySelector("iframe");
  iframe.onload = function () {
    document.querySelector("form").reset();
    hitung();
    loadHistory();
  };
  return true;
}
