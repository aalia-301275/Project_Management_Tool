//register function 
async function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!username || !email || !password) {
    alert("All fields are required");
    return;
  }

  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  alert(data.message);

  //  REDIRECT AFTER SUCCESS
  if (res.ok) {
    window.location.href = "login.html"; 
  }
}

// LOGIN FUNCTION
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("All fields are required");
    return;
  }

  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();
  console.log(data);

  if (data.token) {
  localStorage.setItem("token", data.token);
  alert("Login successful!");

  window.location.href = "dashboard.html"; 
} else {
  alert(data.message);
}
}