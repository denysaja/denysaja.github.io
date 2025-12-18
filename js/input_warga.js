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
    .then(d => {
      master = d;
      localStorage.setItem(CACHE_KEY, JSON.stringify({time: Date.now(), data: d}));
      render(d);
    });
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
