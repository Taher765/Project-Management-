const totalGrossEarned = document.querySelector(".totalGrossEarned");
const totalDeductions = document.querySelector(".totalDeductions");
const totalRewards = document.querySelector(".totalRewards");
const totalDue = document.querySelector(".totalDue");
const totalPaid = document.querySelector(".totalPaid");
const totalRemaining = document.querySelector(".totalRemaining");

const totalWorkers = document.querySelector(".totalWorkers");
const tableBody = document.querySelector(".table-body");

// const basu_url = "https://worker-backend-2.onrender.com/api";
const basu_url = "https://project-management-backend-jco6.onrender.com/api";

addEventListener("load", getMonth);
// GET CURNT MONTH
async function getMonth() {
  loading("d-flex");
  try {
    const response = await fetch(`${basu_url}/archive/project`, {
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    loading("d-none");

    if (data.success) {
      displaydata(data);
      console.log(data);
    } else {
      console.log(data.error);
    }
  } catch (error) {
    loading("d-none");

    console.log(error);
  }
}

// STRAT FUNCTION DISPLAY DATA

function displaydata(data) {
  totalGrossEarned.innerHTML = `
        <h3>اجمالي قبل الخصم والمكافأت</h3>
              <h4 class="text-center text-success">
                <span class="bold">${data.data.summary.totalGrossEarned}</span> <span>ريال</span>
              </h4>
    `;
  totalDeductions.innerHTML = `
        <h3>اجمالي الخصومات</h3>
              <h4 class="text-center text-danger">
                <span class="bold">${data.data.summary.totalDailyDeductions + data.data.summary.totalTransactionDeductions} </span> <span>ريال</span>
              </h4>
    `;
  totalRewards.innerHTML = `
        <h3>اجمالي المكافأت</h3>
              <h4 class="text-center text-info">
                <span class="bold">${data.data.summary.totalRewards} </span> <span>ريال</span>
              </h4>
    `;
  totalDue.innerHTML = `
        <h3>اجمالي المستحق</h3>
              <h4 class="text-center text-primary">
                <span class="bold">${data.data.summary.totalDue}</span> <span>ريال</span>
              </h4>
    `;
  totalPaid.innerHTML = `
         <h3>اجمالي المدفوع</h3>
              <h4 class="text-center text-warning">
                <span class="bold">${data.data.summary.totalPaid}</span> <span>ريال</span>
              </h4>
    `;
  totalRemaining.innerHTML = `
      <h3>اجمالي المتبقي</h3>
              <h4 class="text-danger">
                <span class="bold">${data.data.summary.totalRemaining}</span> <span>ريال</span>
              </h4>
    `;
  totalWorkers.innerHTML = `${data.data.summary.totalWorkers} عامل`;

  let tableContent = "";
  data.data.workers.forEach((worker) => {
    tableContent += `
            <tr>
              <td>${worker.name}</td>
              <td>${worker.attendance.presentDays}</td>
              <td>${worker.attendance.absentDays}</td>
              <td>${worker.attendance.grossEarned}</td>
              <td>${worker.attendance.dailyDeductions + worker.financial.transactionDeductions} <span>ريال</span></td>
              <td>${worker.financial.rewards} <span>ريال</span></td>
              <td>${worker.financial.totalDue} <span>ريال</span></td>
              <td>${worker.financial.paid} <span>ريال</span></td>
              <td>${worker.financial.remaining} <span>ريال</span></td>
              <td>
              
              <a href='profile.html?id=${worker.id}'] class="btn btn-sm btn-warning">عرض</a>
              </td>
            </tr>
        `;
  });
  tableBody.innerHTML = tableContent;
}
