const btnShowEditSallary = document.querySelector(".btn-displayEdit");
const editSallaryDev = document.querySelector(".edit-sallary");
const colseModalEditSallery = document.querySelector(".exit");
const logo = document.querySelector(".logo");
const dataWage = document.querySelector(".data-wage");
const wageSallery = document.querySelector(".wage-sallery");
const editWageInput = document.querySelector(".edit-wage-input");
const btnEditWage = document.querySelector(".btn-edit-wage");
const btnOldWage = document.querySelector(".old-wage");
const btnColseOldWage = document.querySelector(".btnColseOldWage");
const oldWageDev = document.querySelector(".oldWageDev");

const editNameWorker = document.querySelector(".editNameWorker");
const editName = document.querySelector(".editName");

const totalDue = document.querySelector(".totalDue");
const totalPaid = document.querySelector(".totalPaid");
const remaining = document.querySelector(".remaining");
const totalRewards = document.querySelector(".totalRewards");
const totalDiscounts = document.querySelector(".totalDiscounts");
const grossEarned = document.querySelector(".grossEarned");

const btnPayment = document.querySelector(".btn-payment");
const btnReward = document.querySelector(".btn-reward");
const btnDiscount = document.querySelector(".btn-deduction");

const btnTransactionsColse = document.querySelector(".btn-exit-transactions");
const modalTransactions = document.querySelector(".modal-transactions");
const btnApllayTransactions = document.querySelector(
  ".btn-apllay-transactions",
);
const noteInput = document.querySelector(".note");
const amountInput = document.querySelector(".input-amount");

let transactionsType = null;
let transactionsId = null;
let base_url = "https://project-management-backend-jco6.onrender.com/api";
// let base_url = "https://project-management-backend-jco6.onrender.com/api";

// call Function openModal
btnShowEditSallary.addEventListener("click", openModal);

btnPayment.addEventListener("click", openModal);
btnReward.addEventListener("click", openModal);
btnDiscount.addEventListener("click", openModal);

// call Function closeModal
colseModalEditSallery.addEventListener("click", colseModal);
btnTransactionsColse.addEventListener("click", colseModal);

// Start function Display
function openModal(name) {
  if (name.target.getAttribute("data-name") == "sallery") {
    editSallaryDev.classList.remove("popup-none");
    editSallaryDev.classList.add("popup-display");
  } else if (name.target.getAttribute("data-name") == "transactions") {
    modalTransactions.classList.remove("popup-none");
    modalTransactions.classList.add("popup-display");
    transactionsType = name.target.getAttribute("data-transactions");
  }
  editWageInput.value = "";
}

// Start Function colseModal Input Sallary
function colseModal(name) {
  if (name.target.getAttribute("data-name") == "sallery") {
    editSallaryDev.classList.remove("popup-display");
    editSallaryDev.classList.add("popup-none");
  } else if (name.target.getAttribute("data-name") == "transactions") {
    modalTransactions.classList.remove("popup-display");
    modalTransactions.classList.add("popup-none");
  }
  editWageInput.value = "";
}

addEventListener("load", getWorker);

const params = new URLSearchParams(window.location.search);
const workerId = params.get("id");

btnEditWage.addEventListener("click", updateWage);

async function updateWage(name) {
  try {
    const response = await fetch(`${base_url}/workers/${workerId}/wage`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
      body: JSON.stringify({ amount: editWageInput.value }),
    });
    const data = await response.json();

    if (data.success) {
      colseModal(name);
      getWorker();

      toastify(
        `تم تعديل يوميه العامل ${data.data.name} الي ${data.data.currentWage} ريال`,
        "#198754",
      );
    } else {
      toastify(`حدث خطأ من فضلك اعد المحاوله   `, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}

// FUNCTION VIEW OLD WAGE
btnOldWage.addEventListener("click", oldWage);
btnColseOldWage.addEventListener("click", closeoldWage);
function oldWage() {
  oldWageDev.classList.add("popup-display");
  oldWageDev.classList.remove("popup-none");
}
function closeoldWage() {
  oldWageDev.classList.add("popup-none");
  oldWageDev.classList.remove("popup-display");
}
// GEt WORKER
async function getWorker() {
  if (!workerId) {
    window.location = "index.html";
  }
  loading("d-flex");
  try {
    const response = await fetch(`${base_url}/workers/${workerId}`, {
      headers: {
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    loading("d-none");

    if (data.success) {
      displayProfileData(data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading("d-none");
  }
}

function displayProfileData(data) {
  logo.innerHTML = `
  ملف العامل : ${data.data.worker.name}
  `;
  let contentHistory = ``;
  data.data.worker.wageHistory.forEach((wage) => {
    contentHistory += `
      <div class="border p-2 m-2">
        <h4><span>التاريخ :</span> ${wage.effectiveFrom}</h4>
       <h5>اليوميه :  ${wage.amount} ريال</h5>
      </div>
    `;
  });

  document.querySelector(".old-data-wage").innerHTML = contentHistory;

  dataWage.innerHTML = `${data.data.worker.name}`;
  wageSallery.innerHTML = `اليوميه الحاليه : ${data.data.worker.currentWage} ريال`;
  grossEarned.innerHTML = `اجمالي راتب الايام : <span>${data.data.financial.grossEarned} </span>`;
  totalDiscounts.innerHTML = `اجمالي الخصومات : <span>${data.data.financial.totalDiscounts} </span>`;
  totalRewards.innerHTML = `اجمالي المكافأت  : <span>${data.data.financial.totalRewards} </span>`;
  totalDue.innerHTML = `المستحق : <span>${data.data.financial.totalDue} </span>`;
  totalPaid.innerHTML = `المدفوع : <span>${data.data.financial.totalPaid} </span>`;
  remaining.innerHTML = `المتبقي : <span>${data.data.financial.remaining} </span>`;

  let contentInfo = "";

  data.data.transactions.forEach((info) => {
    contentInfo += ` 
              <tr>
                <td>${info.type == "payment" ? "دفعه" : info.type == "deduction" ? "خصم" : info.type == "reward" ? "مكافأه" : info.type == "wage_change" ? "تغير يوميه" : info.type}</td>
                <td>${info.amount}</td>
                <td>${info.note} </td>
                <td>${info.date}</td>
                <td> 
                  <button ${info.type == "wage_change" ? "disabled" : ""} onclick= "deleteTransaction('${info._id}')" class="btn btn-danger btn-sm">حذف</button>
                  <button ${info.type == "wage_change" ? "disabled" : ""}  onclick="openEditTransaction('${info._id}' , '${info.amount}' , '${info.type}' , '${info.note}')" class="btn btn-warning text-light btn-sm">تعديل</button>
                  
                </td>
              </tr>
    `;
  });
  document.querySelector(".table-profile").innerHTML = contentInfo;
}

// STRTA FUNCTION ADD TRANSACTION

btnApllayTransactions.addEventListener("click", addTransaction);

async function addTransaction(name) {
  const body = {
    type: transactionsType,
    amount: amountInput.value,
    note: noteInput.value,
  };

  try {
    if (body.type == "" || body.amount == "" || body.note == "") {
      toastify(`ادخل البيانات بشكل صحيح`, "#dc3545");
      return;
    }
    const response = await fetch(
      `${base_url}/workers/${workerId}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
          "X-Project-Id": localStorage.getItem("projectId"),
        },
        body: JSON.stringify(body),
      },
    );
    const data = await response.json();
    if (data.success) {
      toastify(`تمت العمليه بنجاح`, "#198754");
      colseModal(name);
      getWorker();
    } else {
      toastify(`ادخل البيانات بشكل صحيح`, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}

// START FUNCTION OPEN TRANSACTION MODAL

const popupTransaction = document.querySelector(".popup-transaction");
const btnExitransaction = document.querySelector(".btn-close-transaction");
const selectType = document.querySelector(".select-type");
const inputEditAmount = document.querySelector(".input-edit-amount");
const inputEditNote = document.querySelector(".input-edit-note");
const btnApplyEditTransaction = document.querySelector(
  ".btn-apply-edit-transaction",
);

// STRAT FUNCTION OPEN MODAL EDIT TRANSACTION
btnExitransaction.addEventListener("click", closeTransaction);
function openEditTransaction(id, amount, type, note) {
  popupTransaction.classList.add("popup-display");
  popupTransaction.classList.remove("popup-none");
  if (type == "wage_change") {
    closeTransaction();
    return;
  }
  selectType.value = type;
  inputEditAmount.value = amount;
  inputEditNote.value = note;

  transactionsId = id;
}

// STRAT FUNCTION COLSE MODAL EDIT TRANSACTION
function closeTransaction() {
  popupTransaction.classList.remove("popup-display");
  popupTransaction.classList.add("popup-none");
}

// START FUINCTION SEND EDIT TRANSACTION
btnApplyEditTransaction.addEventListener("click", editTransaction);
async function editTransaction() {
  try {
    const response = await fetch(`${base_url}/transactions/${transactionsId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
      body: JSON.stringify({
        type: selectType.value,
        amount: inputEditAmount.value,
        note: inputEditNote.value,
      }),
    });
    const data = await response.json();
    if (data.success) {
      toastify("نمت تعديل العمليه بنجاح", "#198754");
      closeTransaction();
      getWorker();
    } else {
      toastify("لم يتم اكتمال الطلب ", "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}

// START FUINCTION DELETE TRANSACTION

async function deleteTransaction(id) {
  try {
    const response = await fetch(`${base_url}/transactions/${id}`, {
      method: "DELETE",
      headers: {
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    if (data.success) {
      toastify("تم حذف العمليه بنجاح", "#198754");
      getWorker();
    } else {
      toastify("فشل في تنفيذ الطلب ", "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}

// // START FUNVTION EDIT NAME WORKER
// editNameWorker.addEventListener("click", displayEditName);
// function displayEditName() {
//   editName.classList.remove("d-none");
//   editName.classList.add("d-flex");
// }
// document
//   .querySelector(".closeEditName")
//   .addEventListener("click", hiddenEditName);
// function hiddenEditName() {
//   editName.classList.remove("d-flex");
//   editName.classList.add("d-none");
// }
// document
//   .querySelector(".btnEditName")
//   .addEventListener("click", editNameWorkerFun);
// async function editNameWorkerFun() {
//   const newName = document.querySelector(".editNameInput").value;
//   const body = {
//     name: newName,
//   };
//   try {
//     const response = await fetch(`${base_url}/workers/${workerId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Username": JSON.parse(localStorage.getItem("info")).username,
//         "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
//         "X-Project-Id": localStorage.getItem("projectId"),
//       },
//       body: JSON.stringify({
//         body,
//       }),
//     });
//     const data = await response.json();
//     if (data.success) {
//       console.log(data);
//     } else {
//       console.log(data);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
