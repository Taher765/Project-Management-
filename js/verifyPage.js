const basu_url = "http://localhost:5000/api";

async function verifyAuth() {
  try {
    if (!localStorage.getItem("info")) {
      window.location = "login.html";
    }

    const response = await fetch(`${basu_url}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: JSON.parse(localStorage.getItem("info")).username,
        loginKey: JSON.parse(localStorage.getItem("info")).loginKey,
      }),
    });
    const data = await response.json();

    if (data.success) {
      toastify(`مرحبا ${data.data.username}`);
    } else {
      toastify("من فضلك قم بتسجيل الدخول اولا");
      window.location = "login.html";
    }
  } catch (error) {
    console.log(error);
  }
}
