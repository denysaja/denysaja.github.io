const API_URL = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";
const CACHE_KEY = "master_warga_cache";
const TTL = 86400000;

let master = [];

function loadMaster() {
  const c = localStorage.getItem(CACHE_KEY);
  if (c) {
    const o = JSON.parse(c);
    if (Date.now() - o.time < TTL) {
      master = o.data;
      render(o.data);
      return;
    }
  }

fetch(API_URL + "?master=master_warga")
  .then(r => r.json())
  .then(data => {
    master = data;
    render(data);
  })
  .catch(err => console.error("Master warga error", err));

}

function render(data) {
  const dl = document.getElementById("list_warga");
  dl.innerHTML = "";
  data.forEach(w => {
    const o = document.createElement("option");
    o.value = w.id_warga;
    o.label = w.nama;
    dl.appendChild(o);
  });
}

document.getElementById("id_warga").addEventListener("input", e => {
  const f = master.find(x => x.id_warga == e.target.value);
  document.getElementById("nama").value = f ? f.nama : "";
});

function hitung() {
  let t = 0;
  document.querySelectorAll(".hitung").forEach(i => t += Number(i.value || 0));
  document.getElementById("total").value = t;
}

document.querySelectorAll(".hitung").forEach(i => i.addEventListener("input", hitung));

function sebelumSubmitWarga() {
  hitung();
  return true;
}

hitung();
loadMaster();

function sebelumSubmitWarga() {
  hitung();

  document.getElementById("loadingOverlay").classList.remove("d-none");

  // dengarkan iframe load (response sudah kembali)
  const iframe = document.querySelector('iframe[name="hidden_iframe"]');
  iframe.onload = function () {
    document.getElementById("loadingOverlay").classList.add("d-none");

    const toast = new bootstrap.Toast(
      document.getElementById("toastSuccess"),
	  loadHistoryWarga();
      { delay: 3000 }
    );
    toast.show();

    document.querySelector("form").reset();
    setTanggalHariIni();
  };

  return true;
}

function loadHistoryWarga() {
  fetch(API_URL + "?history=warga")
    .then(r => r.json())
    .then(data => {
      const tb = document.getElementById("historyWarga");
      tb.innerHTML = "";

      if (!data.length) {
        tb.innerHTML = `<tr><td colspan="3" class="text-muted">Belum ada data</td></tr>`;
        return;
      }

      data.forEach(r => {
        tb.innerHTML += `
          <tr>
            <td>${r.nama}</td>
            <td>${formatBulan(r.bulan_dibayar)}</td>
            <td class="text-end">${Number(r.total).toLocaleString("id-ID")}</td>
          </tr>`;
      });
    })
    .catch(err => console.error("History warga error", err));
}

function formatBulan(val) {
  if (!val) return "";
  const d = new Date(val);
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}
