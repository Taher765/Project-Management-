const btnShowEditSallary = document.querySelector(".btn-displayEdit");
const editSallaryDev = document.querySelector(".edit-sallary");
const colseModalEditSallery = document.querySelector(".exit");
const logo = document.querySelector(".logo");

const totalDue = document.querySelector(".totalDue");
const totalPaid = document.querySelector(".totalPaid");
const remaining = document.querySelector(".remaining");
const totalRewards = document.querySelector(".totalRewards");
const totalDiscounts = document.querySelector(".totalDiscounts");
const grossEarned = document.querySelector(".grossEarned");

const base_url = "http://localhost:5000/api";

addEventListener("load", getWorker);

const params = new URLSearchParams(window.location.search);
const workerId = params.get("id");

// FUNCTION VIEW OLD WAGE

// GEt WORKER
async function getWorker() {
  if (!workerId) {
    window.location = "index.html";
  }
  loading("d-flex");
  try {
    const response = await fetch(`${base_url}/workers/${workerId}/monthly`, {
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
      console.log(data);
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
                
              </tr>
    `;
  });
  document.querySelector(".table-profile").innerHTML = contentInfo;
}
