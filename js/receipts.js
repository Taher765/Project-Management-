const tablerReceipts = document.querySelector(".tablerReceipts");
const amount = document.querySelector(".amount");
const categores = document.querySelector(".categores");
const date = document.querySelector(".date");
const note = document.querySelector(".note");
const addRecepits = document.querySelector(".addRecepits");
const btnEdit = document.querySelector(".btnEdit");
const dayEx = document.querySelector(".day");
const week = document.querySelector(".week");
const month = document.querySelector(".month");
const total = document.querySelector(".total");

const base_url = "https://project-management-backend-jco6.onrender.com/api";
const projectId = localStorage.getItem("projectId");
let recepitsID = null;
// VERIFYCTION PAGE
addEventListener("DOMContentLoaded", verifyAuth);

addEventListener("load", getAllRecepits);

// GEt receipts
async function getAllRecepits() {
  loading("d-flex");
  try {
    const response = await fetch(`${base_url}/projects/${projectId}/receipts`, {
      headers: {
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
      },
    });
    const data = await response.json();
    loading("d-none");

    if (data.success) {
      displayRecepitsData(data);
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading("d-none");
  }
}

// START FUNCTION DISPLAY DATA
function displayRecepitsData(data) {
  dayEx.innerHTML = data.summary.day.total + " ريال ";
  week.innerHTML = data.summary.week.total + " ريال ";
  month.innerHTML = data.summary.month.total + " ريال ";
  total.innerHTML = data.summary.total + " ريال ";

  let contentInfo = "";
  data.data.forEach((info) => {
    contentInfo += `
              <tr>
                <td>${info.amount}</td>
                <td>${info.note} </td>
                <td>${info.date}</td>
                <td>
                  <button  onclick="deleteRecrpits('${info._id}')" class="btn btn-danger btn-sm">حذف</button>
                  <button   onclick="editRecepits('${info._id}' , '${info.amount}' , '${info.note}' , '${info.date}')" class="btn btn-warning text-light btn-sm">تعديل</button>

                </td>
              </tr>
    `;
  });
  tablerReceipts.innerHTML = contentInfo;
}

// START FUNCTION ADD RECEPITS
addRecepits.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${base_url}/projects/${projectId}/receipts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
      },
      body: JSON.stringify({
        amount: amount.value,
        date: date.value,
        note: note.value,
      }),
    });
    const data = await response.json();

    if (data.success) {
      toastify(`تم اتمام العمليه بنجاح`, "#198754");
      getAllRecepits();
      clearInputs();
    } else {
      toastify(
        `حدث خطأ من فضلك ادخل البيانات بشكل صحيح واعد المحاوله   `,
        "#dc3545",
      );
    }
  } catch (error) {
    console.log(error);
  }
});
// START FUNCTION CLEAR DATA
function clearInputs() {
  amount.value = "";
  date.value = "";
  note.value = "";
}

// STRAT FUNCTION EDIT RESEPITS
function editRecepits(id, amountPar, notePar, datepar) {
  recepitsID = id;

  amount.value = amountPar;
  date.value = datepar;
  note.value = notePar;
  btnEdit.classList.remove("d-none");
  btnEdit.classList.add("d-inline");
  addRecepits.classList.add("d-none");
  addRecepits.classList.remove("d-inline");
}

btnEdit.addEventListener("click", async (e) => {
  e.preventDefault();
  btnEdit.classList.add("d-none");
  btnEdit.classList.remove("d-inline");
  addRecepits.classList.add("d-inline");
  addRecepits.classList.remove("d-none");

  try {
    const response = await fetch(
      `${base_url}/projects/${projectId}/receipts/${recepitsID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        },
        body: JSON.stringify({
          amount: amount.value,
          date: date.value,
          note: note.value,
        }),
      },
    );
    const data = await response.json();

    if (data.success) {
      toastify(`تم اتمام العمليه بنجاح`, "#198754");
      clearInputs();
      getAllRecepits();
    } else {
      toastify(`حدث خطأ من فضلك اعد المحاوله   `, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
});

// STRAT FUNCTION DELETE RECEPITS
async function deleteRecrpits(id) {
  try {
    const response = await fetch(
      `${base_url}/projects/${projectId}/receipts/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        },
      },
    );
    const data = await response.json();

    if (data.success) {
      toastify(`تم اتمام العمليه بنجاح`, "#198754");
      getAllRecepits();
    } else {
      toastify(`حدث خطأ من فضلك اعد المحاوله   `, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}
