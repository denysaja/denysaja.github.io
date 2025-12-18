const API_URL = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";
const CACHE_KEY = "master_ibu2_cache";
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

  fetch(API_URL + "?master=master_ibu2")
    .then(r => r.json())
    .then(d => {
      master = d;
      localStorage.setItem(CACHE_KEY, JSON.stringify({time: Date.now(), data: d}));
      render(d);
    });
}

function render(data) {
  const dl = document.getElementById("list_ibu2");
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
  document.getElementById("dasawisma").value = f ? f.dasawisma : "";
});

function hitung() {
  document.getElementById("total").value =
    Number(document.getElementById("rupiah_bayar").value || 0);
}

document.getElementById("rupiah_bayar").addEventListener("input", hitung);

function sebelumSubmitIbu2() {
  hitung();
  return true;
}

hitung();
loadMaster();

function sebelumSubmitIbu2() {
  hitung();

  document.getElementById("loadingOverlay").classList.remove("d-none");
  return true;
}

// ===============================
// TOAST AFTER REDIRECT
// ===============================
const params = new URLSearchParams(window.location.search);
if (params.get("status") === "ok") {
  const toastEl = document.getElementById("toastSuccess");
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();

  // bersihkan URL
  history.replaceState({}, document.title, window.location.pathname);
}
