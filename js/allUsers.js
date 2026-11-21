const acountDev = document.querySelector(".acount");
const name = document.querySelector(".name");
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const editAcount = document.querySelector(".editAcount");
const closeBtn = document.querySelector(".close");
const tableAcounts = document.querySelector(".tableAcounts");
const acountInfo = JSON.parse(localStorage.getItem("info"));

let globalID = null;
const base_url = "http://localhost:5000/api";

async function getAllAcounts() {
  try {
    const response = await fetch(`${base_url}/auth/users`, {
      method: "GET",
      headers: {
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    if (data.success) {
      console.log(data);
      displayAcounts(data);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
}

function displayAcounts(data) {
  let acountInfo = "";
  data.data.forEach((acount, index) => {
    acountInfo += `
        <tr class="">
                <td>${index + 1}</td>
                <td>${acount.id}</td>
                <td>${acount.username}</td>
                <td>${acount.email}</td>
                <td>${acount.role}</td>
                <td>${acount.createdAt}</td>
                <td>
                    <button onclick="deleteAcount('${acount.id}')" class="btn btn-danger">حذف</button>
                    <button onclick="displayEditAcount('${acount.id}')" class="btn btn-warning">تعديل</button>
                </td>
              </tr>
        `;
  });
  tableAcounts.innerHTML = acountInfo;
}

getAllAcounts();

// STRAT FUNCTION DELETE ACOUNT WITH ADMIN ONLY

async function deleteAcount(id) {
  const isDeleted = confirm("هل انت متأكد من حذف حسابك نهائيا");
  if (isDeleted) {
    try {
      const response = await fetch(`${base_url}/auth/users/${id}`, {
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
        getAllAcounts();
      } else {
        console.log(data);
        toastify(data.message, "#dc3545");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// STRAT FUNCTION EDIT ADMIN ACOUNT

async function displayEditAcount(id) {
  acountDev.classList.add("d-block");
  try {
    const response = await fetch(`${base_url}/auth/users`, {
      method: "GET",
      headers: {
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    if (data.success) {
      console.log(data);
      const acount = data.data.filter((item) => {
        return item.id == id ? item : null;
      });

      name.value = acount[0].username;
      email.value = acount[0].email;
      globalID = acount[0].id;
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
}

editAcount.addEventListener("click", async () => {
  console.log(globalID);

  try {
    const response = await fetch(`${base_url}/auth/users/${globalID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Login-Key": acountInfo.loginKey,
      },
      body: JSON.stringify({
        username: name.value,
        email: email.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    if (data.success) {
      console.log(data);
      toastify(`تم حذف الحساب بنجاح`, "#198754");
      acountDev.classList.remove("d-block");
      getAllAcounts();
    } else {
      console.log(data);
      toastify(data.message, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
});

closeBtn.addEventListener("click", () => {
  acountDev.classList.remove("d-block");
});
