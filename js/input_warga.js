const loginToken = localStorage.getItem("login_token");

if (!loginToken) {
  window.location.href = "login.html";
}

document.getElementById("login_token").value =
  localStorage.getItem("login_token");

const API_URL = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";

/* tanggal hari ini */
document.getElementById("tgl_bayar").value =
  new Date().toISOString().split("T")[0];

/* autocomplete */
let master=[];
fetch(API_URL+"?master=master_warga")
.then(r=>r.json()).then(d=>{
  master=d;
  const dl=document.getElementById("list_warga");
  d.forEach(w=>{
    const o=document.createElement("option");
    o.value=w.id_warga; o.label=w.nama;
    dl.appendChild(o);
  });
});

document.getElementById("id_warga").addEventListener("input",e=>{
  const f=master.find(x=>x.id_warga==e.target.value);
  document.getElementById("nama").value=f?f.nama:"";
});

/* total */
function hitung(){
  let t=0;
  document.querySelectorAll(".hitung").forEach(i=>t+=Number(i.value||0));
  document.getElementById("total").value=t;
}
document.querySelectorAll(".hitung").forEach(i=>i.oninput=hitung);
hitung();

/* history */
function loadHistory(){
  fetch(API_URL+"?history=warga")
  .then(r=>r.json()).then(d=>{
    const tb=document.getElementById("historyWarga");
    tb.innerHTML="";
    d.forEach(r=>{
      tb.innerHTML+=`
      <tr>
        <td>${r.nama}</td>
        <td>${new Date(r.bulan_dibayar).toLocaleDateString("id-ID",{month:"long",year:"numeric"})}</td>
        <td class="text-end">${Number(r.total).toLocaleString("id-ID")}</td>
      </tr>`;
    });
  });
}
loadHistory();

/* submit */
function sebelumSubmitWarga(){
  hitung();
  document.getElementById("loadingOverlay").classList.remove("d-none");
  const iframe=document.querySelector("iframe");
iframe.onload = function () {

  const status = iframe.contentWindow.name;

  document.getElementById("loadingOverlay").classList.add("d-none");

  if (status === "DUPLICATE") {
    new bootstrap.Toast(
      document.getElementById("toastDuplicate"),
      { delay: 4000 }
    ).show();
    return;
  }

  if (status === "OK") {
    new bootstrap.Toast(
      document.getElementById("toastSuccess"),
      { delay: 3000 }
    ).show();

    document.querySelector("form").reset();
    hitung();
    loadHistory();
    return;
  }

  console.error("Status tidak dikenal:", status);
};

  return true;
}

function formatBulan(val) {
  if (!val) return "";
  const d = new Date(val);
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}
