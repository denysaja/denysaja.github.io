const API = "https://script.google.com/macros/s/AKfycbyrGqqPlELhSMSN1CM-3tGTLn0um20alb96tfM3pp8J4uET5Tykej6UmlyX4IJfo5Br5Q/exec";

function login() {
  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      type: "login",
      username: user.value,
      password: pass.value
    })
  })
  .then(r => r.json())
  .then(res => {
    if (res.status === "OK") {
      localStorage.setItem("login", "true");
      location.href = "dashboard.html";
    } else {
      msg.innerText = "Login gagal!";
    }
  });
}
