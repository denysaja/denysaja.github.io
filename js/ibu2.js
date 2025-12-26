const API = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";

/* autocomplete */
fetch(API+"?master=ibu2")
.then(r=>r.json())
.then(d=>{
  const dl=document.getElementById("ibuList");
  d.forEach(x=>{
    const o=document.createElement("option");
    o.value=x.id;
    o.label=x.nama;
    dl.appendChild(o);
  });
});

function simpan(){
  fetch(API,{
    method:"POST",
    body:JSON.stringify({
      type:"ibu2",
      id:id.value,
      nama:nama.value,
      bulan:bulan.value,
      tgl:tgl.value,
      jumlah:jumlah.value,
      dasawisma:dasawisma.value
    })
  });
}
