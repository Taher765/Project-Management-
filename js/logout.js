const btnLogout = document.querySelector(".btnLogout");
btnLogout.addEventListener("click", logout);

async function logout() {
  try {
    const response = await fetch(`${base_url}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
      },
    });
    const data = await response.json();

    if (data.success) {
      console.log(data);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
  localStorage.clear();
  window.location = "login.html";
}
