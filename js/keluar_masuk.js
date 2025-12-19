const API_URL = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";
const CACHE_KEY = "master_keluar_masuk";
const TTL = 86400000;

let masterJenis = [];

/* ===== default tanggal hari ini ===== */
(function setToday(){
  const el = document.querySelector('input[name="tanggal"]');
  if (el && !el.value) el.value = new Date().toISOString().split("T")[0];
})();

/* ===== load master jenis (cache) ===== */
function loadJenis() {
  const c = localStorage.getItem(CACHE_KEY);
  if (c) {
    const o = JSON.parse(c);
    if (Date.now() - o.time < TTL) {
      masterJenis = o.data;
      render(o.data);
      return;
    }
  }

  fetch(API_URL + "?master=master_keluar_masuk")
    .then(r => r.json())
    .then(d => {
      masterJenis = d;
      localStorage.setItem(CACHE_KEY, JSON.stringify({time:Date.now(), data:d}));
      render(d);
    });
}

function render(data){
  const s = document.getElementById("jenis");
  s.innerHTML = '<option value="">-- pilih --</option>';
  data.forEach(x=>{
    const o = document.createElement("option");
    o.value = x.jenis;
    o.textContent = x.jenis;
    s.appendChild(o);
  });
}

/* ===== submit ===== */
function sebelumSubmitKM(){
  document.getElementById("loadingOverlay").classList.remove("d-none");

  const iframe = document.querySelector('iframe[name="hidden_iframe"]');
  iframe.onload = function(){
    document.getElementById("loadingOverlay").classList.add("d-none");
    new bootstrap.Toast(document.getElementById("toastSuccess"),{delay:3000}).show();
    document.querySelector("form").reset();
    setToday();
  };
  return true;
}

loadJenis();
