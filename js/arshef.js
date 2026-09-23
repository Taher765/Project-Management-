const dateMonth = document.querySelector(".date-month");

const inputYear = document.querySelector(".input-year");
const inputMonth = document.querySelector(".input-month");
const btnSearch = document.querySelector(".btn-search");

const titleMonth = document.querySelector(".title-month");
const totalDue = document.querySelector(".totalDue");
const totalPaid = document.querySelector(".totalPaid");
const totalRemaining = document.querySelector(".totalRemaining");

const totalWorkers = document.querySelector(".totalWorkers");
const tableBody = document.querySelector(".table-body");

let containerSheet = [];
// const basu_url = "https://worker-backend-2.onrender.com/api";
const basu_url = "http://localhost:5000/api";

addEventListener("load", getMonth);
// GET CURNT MONTH
async function getMonth() {
  loading("d-flex");
  try {
    const response = await fetch(`${basu_url}/archive/month`, {
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
      containerSheet = data;
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
  dateMonth.innerHTML = `  
  عرض مصروفات الشهر من <span>${data.data.month.startDate}</span> الي
              <span>${data.data.month.endDate}</span>`;
  titleMonth.innerHTML = `
        <h3>${data.data.month.monthName} ${data.data.month.year}</h3>
        <h6>
            <span class="bold">${data.data.month.startDate}</span> - <span>${data.data.month.endDate}</span>
        </h6>
    `;
  totalDue.innerHTML = `
        <h3>اجمالي المستحق</h3>
              <h4 class="text-center text-primary">
                <span class="bold">${data.data.summary.totalDue}</span> <span>ريال</span>
              </h4>
    `;
  totalPaid.innerHTML = `
         <h3>اجمالي المدغوع</h3>
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
  data.data.workers.forEach((worker, index) => {
    tableContent += `
            <tr>
              <td>${worker.name}</td>
              <td>${worker.attendance.presentDays}</td>
              <td>${worker.attendance.absentDays}</td>
              <td>${worker.attendance.grossEarned}</td>
              <td>${worker.financial.totalDiscounts} <span>ريال</span></td>
              <td>${worker.financial.rewards} <span>ريال</span></td>
              <td>${worker.financial.totalDue} <span>ريال</span></td>
              <td>${worker.financial.paid} <span>ريال</span></td>
              <td>${worker.financial.remaining} <span>ريال</span></td>
              <td class="d-flex gap-2">
                <a class="btn btn-warning text-nowrap btn-sm" href="month-profile.html?id=${worker.id}">عرض العامل</a>
        <button class="btn btn-sm btn-success export" onclick='exportSheet(${index})'>تصدير</button>
                
              </td>
            </tr>
        `;
  });
  tableBody.innerHTML = tableContent;
}

btnSearch.addEventListener("click", searchMonths);
async function searchMonths() {
  if (
    inputYear.value == "" ||
    inputYear.value < 2026 ||
    inputMonth.value == ""
  ) {
    toastify("ادخل تاريخ صالح", "#dc3545");
    return;
  }

  try {
    const response = await fetch(
      `${basu_url}/archive/month?year=${inputYear.value}&month=${inputMonth.value}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
          "X-Project-Id": localStorage.getItem("projectId"),
        },
      },
    );
    const data = await response.json();
    if (data.success) {
      displaydata(data);
    } else {
      console.log(data);
      toastify("ادخل تاريخ صالح", "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}

function exportSheet(index) {
  console.log(containerSheet.data.workers[index]);

  const pureArr = [
    {
      "تاريخ الشهر": `${containerSheet.data.month.month} - ${
        containerSheet.data.month.year
      } `,
      " اسم العامل": containerSheet.data.workers[index].name,
      " ايام الحضور ":
        containerSheet.data.workers[index].attendance.presentDays,
      " خصم  ":
        containerSheet.data.workers[index].financial.transactionDeductions,
      " سهرات او مكافات  ":
        containerSheet.data.workers[index].financial.rewards,
      "  المستحق   ": containerSheet.data.workers[index].financial.totalDue,
      "  المدفوع   ": containerSheet.data.workers[index].financial.paid,
      "  المتبقي   ": containerSheet.data.workers[index].financial.remaining,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(pureArr);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    `حساب شهر ${containerSheet.data.month.month} - ${
      containerSheet.data.month.year
    }  ${containerSheet.data.workers[index].name}`,
  );
  XLSX.writeFile(
    workbook,
    `حساب شهر ${containerSheet.data.month.month} - ${
      containerSheet.data.month.year
    }  ${containerSheet.data.workers[index].name}.xlsx`,
  );
}
