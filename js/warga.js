const API = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";

/* autocomplete */
fetch(API + "?master=warga")
.then(r=>r.json())
.then(d=>{
  const dl = document.getElementById("wargaList");
  d.forEach(x=>{
    const o=document.createElement("option");
    o.value=x.id_warga;
    o.label=x.nama;
    dl.appendChild(o);
  });
});

function simpan(){
  fetch(API,{
    method:"POST",
    body:JSON.stringify({
      type:"warga",
      id:id.value,
      nama:nama.value,
      bulan:bulan.value,
      tgl:tgl.value,
      kas:kas.value,
      kematian:kematian.value,
      agustus:agustus.value,
      konsumsi:konsumsi.value,
      sampah:sampah.value,
      total:
        +kas.value+
        +kematian.value+
        +agustus.value+
        +konsumsi.value+
        +sampah.value
    })
  })
  .then(r=>r.json())
  .then(r=>{
    msg.innerText = r.status=="OK"
      ? "✅ Berhasil"
      : "⚠️ Data sudah ada";
  });
}
