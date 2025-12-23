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

  // dengarkan iframe load (response sudah kembali)
  const iframe = document.querySelector('iframe[name="hidden_iframe"]');
  iframe.onload = function () {
    document.getElementById("loadingOverlay").classList.add("d-none");

    const toast = new bootstrap.Toast(
      document.getElementById("toastSuccess"),
	  loadHistoryIbu2();
      { delay: 3000 }
    );
    toast.show();

    document.querySelector("form").reset();
    setTanggalHariIni();
  };

  return true;
}

function loadHistoryIbu2() {
  fetch(API_URL + "?history=ibu2")
    .then(r => r.json())
    .then(data => {
      const tb = document.getElementById("historyIbu2");
      tb.innerHTML = "";
      data.forEach(r => {
        tb.innerHTML += `
          <tr>
            <td>${r.nama}</td>
            <td>${r.bulan_bayar}</td>
            <td class="text-end">${Number(r.total).toLocaleString("id-ID")}</td>
          </tr>`;
      });
    });
}

loadHistoryIbu2();

function formatBulan(val) {
  if (!val) return "";
  const d = new Date(val);
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}
