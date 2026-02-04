document
  .getElementById("signinForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document
      .querySelector("#signinForm input[name='username']")
      .value.trim();
    const password = document.querySelector(
      "#signinForm input[name='password']"
    ).value;
    if (!username || !password) {
      alert("Please fill in all details first");
      return;
    }
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        window.location.href = "add.html";
      } else {
        alert("⚠️ " + data.message);
      }
    } catch {
      alert("Server error. Please try again later.");
    }
  });
function togglePassword() {
  const pwd = document.getElementById("password");
  const eye = document.getElementById("eyeIcon");

  if (pwd.type === "password") {
    pwd.type = "text";
    eye.src = "https://cdn-icons-png.flaticon.com/512/565/565655.png";
  } else {
    pwd.type = "password";
    eye.src = "https://cdn-icons-png.flaticon.com/512/159/159604.png";
  }
}
