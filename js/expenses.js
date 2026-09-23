const tableExpenses = document.querySelector(".tableExpenses");
const amount = document.querySelector(".amount");
const categores = document.querySelector(".categores");
const date = document.querySelector(".date");
const note = document.querySelector(".note");
const addExpenses = document.querySelector(".addExpenses");
const btnEdit = document.querySelector(".btnEdit");
const dayEx = document.querySelector(".day");
const week = document.querySelector(".week");
const month = document.querySelector(".month");
const total = document.querySelector(".total");

let exportSheet = null;
const base_url = "http://localhost:5000/api";
const projectId = localStorage.getItem("projectId");
let expenseId = null;
// VERIFYCTION PAGE
addEventListener("DOMContentLoaded", verifyAuth);

addEventListener("load", getWorker);

// GEt WORKER
async function getWorker() {
  loading("d-flex");
  try {
    const response = await fetch(`${base_url}/projects/${projectId}/expenses`, {
      headers: {
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
      },
    });
    const data = await response.json();
    loading("d-none");

    if (data.success) {
      displayExpensesData(data);
      exportSheet = data;
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading("d-none");
  }
}

// START FUNCTION DISPLAY DATA
function displayExpensesData(data) {
  dayEx.innerHTML = data.summary.day.total + " ريال ";
  week.innerHTML = data.summary.week.total + " ريال ";
  month.innerHTML = data.summary.month.total + " ريال ";
  total.innerHTML = data.summary.total + " ريال ";
  let content = ``;
  data.summary.categories.forEach((cat) => {
    content += `
    <div class="col-lg-3 mb-4 col-md-6 col-sm-12">
          <div class="border text-center p-3 rounded">
            <h5>${cat.label}</h5>
            <strong class="">مصروف اليوم : ${cat.day.total} </strong> <br>
            <strong class="">مصروف الاسبوع : ${cat.week.total} </strong> <br>
            <strong class="">مصروف الشهر : ${cat.month.total} </strong> <br>
            <h6 class="day"> اجمالي المشروع :  ${cat.total}  ريال</h6>
          </div>
        </div>
`;
  });
  document.querySelector(".categores-type").innerHTML = content;
  let contentInfo = "";
  data.data.forEach((info) => {
    contentInfo += ` 
              <tr>
                <td>${info.category == "other" ? "اخري" : info.category == "tools" ? "عده" : info.category == "transport" ? "مواصلات" : info.category == "food" ? "اكل وماء" : info.category == "materials" ? "خامات" : info.category == "maintenance" ? "صيانه" : info.category == "rent" ? "ايجار" : info.category == "utilities" ? "كهرباء وماء" : info.category}</td>
                <td>${info.amount}</td>
                <td>${info.note} </td>
                <td>${info.date}</td>
                <td> 
                  <button  onclick="deleteExpense('${info._id}')" class="btn btn-danger btn-sm">حذف</button>
                  <button   onclick="editExpense('${info._id}' , '${info.amount}' , '${info.category}' , '${info.note}' , '${info.date}')" class="btn btn-warning text-light btn-sm">تعديل</button>
                  
                </td>
              </tr>
    `;
  });
  tableExpenses.innerHTML = contentInfo;
}

addExpenses.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log(categores.value);

  try {
    const response = await fetch(`${base_url}/projects/${projectId}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
      },
      body: JSON.stringify({
        amount: amount.value,
        category: categores.value,
        date: date.value,
        note: note.value,
      }),
    });
    const data = await response.json();

    if (data.success) {
      toastify(`تم اتمام العمليه بنجاح`, "#198754");
      getWorker();
      clearInputs();
    } else {
      toastify(`حدث خطأ من فضلك اعد المحاوله   `, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
});

function clearInputs() {
  amount.value = "";
  date.value = "";
  note.value = "";
  categores.value = "";
}

// STRAT FUNCTION EDIT EXPENSES
function editExpense(id, amountPar, category, notePar, datepar) {
  expenseId = id;

  amount.value = amountPar;
  date.value = datepar;
  note.value = notePar;
  categores.value = category;
  btnEdit.classList.remove("d-none");
  btnEdit.classList.add("d-inline");
  addExpenses.classList.add("d-none");
  addExpenses.classList.remove("d-inline");
}

btnEdit.addEventListener("click", async (e) => {
  e.preventDefault();
  btnEdit.classList.add("d-none");
  btnEdit.classList.remove("d-inline");
  addExpenses.classList.add("d-inline");
  addExpenses.classList.remove("d-none");

  try {
    const response = await fetch(
      `${base_url}/projects/${projectId}/expenses/${expenseId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        },
        body: JSON.stringify({
          amount: amount.value,
          category: categores.value,
          date: date.value,
          note: note.value,
        }),
      },
    );
    const data = await response.json();

    if (data.success) {
      toastify(`تم اتمام العمليه بنجاح`, "#198754");
      clearInputs();
      getWorker();
    } else {
      toastify(`حدث خطأ من فضلك اعد المحاوله   `, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
});

// STRAT FUNCTION DELETE EXPENSE

async function deleteExpense(id) {
  try {
    const response = await fetch(
      `${base_url}/projects/${projectId}/expenses/${id}`,
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
      getWorker();
    } else {
      toastify(`حدث خطأ من فضلك اعد المحاوله   `, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}

document.querySelector(".export").addEventListener("click", () => {
  const pureArr = [
    {
      "تاريخ الشهر": `${exportSheet.summary.month.startDate} - ${
        exportSheet.summary.month.endDate
      } `,
      "اكل وماء": exportSheet.summary.categories[0].month.total,
      مواصلات: exportSheet.summary.categories[1].month.total,
      خامات: exportSheet.summary.categories[2].month.total,
      عده: exportSheet.summary.categories[3].month.total,
      صيانه: exportSheet.summary.categories[4].month.total,
      ايجار: exportSheet.summary.categories[5].month.total,
      "مصاريف سكن": exportSheet.summary.categories[6].month.total,
      اخري: exportSheet.summary.categories[7].month.total,
      "حساب الشهر": exportSheet.summary.month.total,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(pureArr);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "مصروفات الشهر");
  XLSX.writeFile(
    workbook,
    `مصروفات الشهر من ${exportSheet.summary.month.startDate} - ${
      exportSheet.summary.month.endDate
    }.xlsx`,
  );
});
