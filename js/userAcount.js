const name = document.querySelector(".name");
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const role = document.querySelector(".role");
const createUsername = document.querySelector(".createUsername");
const createEmail = document.querySelector(".createEmail");
const createPassword = document.querySelector(".createPassword");
const confirmPassword = document.querySelector(".confirmPassword");

const btnCreateAcount = document.querySelector(".btnCreateAcount");
const editAcount = document.querySelector(".editAcount");
const deleteAcount = document.querySelector(".deleteAcount");
const titleProject = document.querySelector(".logo span");
const acountInfo = JSON.parse(localStorage.getItem("info"));

// const base_url = "http://localhost:5000/api";
const base_url = "https://project-management-backend-jco6.onrender.com/api";

// GET PROJECT INFO
addEventListener("DOMContentLoaded", getProject);
async function getProject() {
  try {
    const response = await fetch(
      `${base_url}/projects/${localStorage.getItem("projectId")}`,
      {
        headers: {
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        },
      },
    );
    const data = await response.json();
    if (data.success) {
      titleProject.innerHTML = data.data.project.name;
    }
  } catch (error) {
    console.log(error);
  }
}

// Get Acount Data From localStorage
function getInfoAcountFromLocalStorage() {
  name.value = acountInfo.username;
  email.value = acountInfo?.email;
  role.value = acountInfo.role;
}

getInfoAcountFromLocalStorage();

// FUNCTION EDIT ACOUNT
editAcount.addEventListener("click", editAcountFnc);
async function editAcountFnc() {
  try {
    const response = await fetch(`${base_url}/auth/users/${acountInfo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Login-Key": acountInfo.loginKey,
      },
      body: JSON.stringify({
        username: name.value,
        email: email.value,
        password: password.value,
        role: role.value,
      }),
    });
    const data = await response.json();

    if (data.success) {
      console.log(data);

      setUserLocalStorage(
        data.data.username,
        acountInfo.loginKey,
        data.data.role,
        data.data.id,
        data.data.email,
      );
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
}

// FUNCTION CREATE ACOUNT
btnCreateAcount.addEventListener("click", createAcountFun);
async function createAcountFun() {
  const match = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.exec(createEmail.value);
  if (!match) {
    toastify(`ادخل ايميل صحيح `, "#dc3545");
    return;
  }
  if (confirmPassword.value != createPassword.value) {
    toastify(`كلمه السر غير متطابه `, "#dc3545");
    return;
  }

  try {
    const response = await fetch(`${base_url}/auth/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Login-Key": acountInfo.loginKey,
      },
      body: JSON.stringify({
        username: createUsername.value,
        email: createEmail.value,
        password: createPassword.value,
      }),
    });
    const data = await response.json();

    if (data.success) {
      console.log(data);
      toastify(`تم انشاء الحساب بنجاح`, "#198754");
    } else {
      console.log(data);
      toastify(data.message, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}

// FUNCTIO DELETE ACOUNT

deleteAcount.addEventListener("click", async () => {
  const isDeleted = confirm("هل انت متأكد من حذف حسابك نهائيا");
  if (isDeleted) {
    try {
      const response = await fetch(`${base_url}/auth/users/${acountInfo.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Login-Key": acountInfo.loginKey,
        },
      });
      const data = await response.json();

      if (data.success) {
        console.log(data);
        toastify(`تم حذف الحساب بنجاح`, "#198754");
        window.location = "login.html";
      } else {
        console.log(data);
        toastify(data.message, "#dc3545");
      }
    } catch (error) {
      console.log(error);
    }
  }
});
