document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.querySelector("#signupForm input[name='username']").value.trim();
    const email = document.querySelector("#signupForm input[name='email']").value.trim();
    const password1 = document.querySelector("#signupForm input[name='password1']").value;
    const password2 = document.querySelector("#signupForm input[name='password2']").value;

    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const passLength = /.{6,}/;
    const upperCase = /[A-Z]/;
    const digit = /\d/;

    if (!username || !email || !password1 || !password2) {
        alert("Please fill all fields first");
        return;
    }
    if (/\s/.test(username)) {
        alert("Username cannot have white space");
        return;
    }
    if (!passLength.test(password1) || !specialChar.test(password1) || !upperCase.test(password1) || !digit.test(password1)) {
        alert("❌ Weak Password\nPassword must contain at least:\n i) An uppercase character\n ii) A special character\n iii) A digit\n iv) Minimum 6 characters");
        return;
    }
    if (password1 !== password2) {
        alert("❌ Passwords do not match!");
        return;
    }

    try {
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password: password1 })
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            window.location.href = "signin.html";
        } else {
            alert("⚠️ " + data.message);
        }
    } catch {
        alert("Server error. Please try again later.");
    }
});