const username = document.getElementById("username");
const password = document.getElementById("password");
const message = document.getElementById("message");
const btnSupmit = document.getElementById("btnSupmit");

// const basu_url = "https://project-management-backend-jco6.onrender.com/api";
const basu_url = "https://project-management-backend-jco6.onrender.com/api";

addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loading("d-none");
  }, 1000);
});
btnSupmit.addEventListener("click", login);

async function login(e) {
  e.preventDefault();
  if (username.value == "" || password.value == "") {
    toastify("خطأ في تسجيل الدخول ", "#dc3545");
    return;
  }

  const body = {
    username: username.value,
    password: password.value,
  };
  try {
    const response = await fetch(`${basu_url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.success) {
      setUserLocalStorage(data.data.username, data.data.loginKey);
      window.location = "projects.html";
    } else {
      toastify(data.message, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}
