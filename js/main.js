const btnViewOverlay = document.getElementById("view-overlay");
const overlay = document.querySelector(".overlay");
const btnExitOverlayAddWorker = document.querySelector(
  ".btn-exit-overlay-add-worker",
);

const btnAddWorker = document.querySelector(".btn-add-worker");
const addWorkerInput = document.querySelector(".add-worker-input");
const wage = document.querySelector(".wage");

const titleProject = document.querySelector(".logo span");
const btnSerchWorker = document.querySelector(".btn-serch-worker");

const searchWeek = document.querySelector("#search-week");
const btnViewWeek = document.querySelector(".view-week");

const btnPrev = document.querySelector(".btnPrev");
const btnNext = document.querySelector(".btn-next");

const titleDate = document.querySelector(".title-date");
const tableHead = document.querySelector(".tableHead");
const tableBody = document.querySelector(".tableBody");

const base_url = "https://project-management-backend-jco6.onrender.com/api";

let dateNow = null;
let globalWeekId = null;
// VERIFYCTION PAGE
addEventListener("DOMContentLoaded", verifyAuth);
// GET PROJECT ID
addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  let projectId = params.get("id");
  if (!projectId) {
    projectId = localStorage.getItem("projectId");
  } else {
    localStorage.setItem("projectId", projectId);
  }
});

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

// load date From db
addEventListener("DOMContentLoaded", getWeek);

// Open And Close Modal Add Worker
btnViewOverlay.addEventListener("click", openModalOverlay);
btnExitOverlayAddWorker.addEventListener("click", colseModalOverlay);
function openModalOverlay() {
  overlay.classList.add("display-overlay");
}
function colseModalOverlay() {
  addWorkerInput.value = "";
  wage.value = "";
  overlay.classList.remove("display-overlay");
}

// Start Function get data From DB

async function getWeek() {
  loading("d-flex");
  try {
    const response = await fetch(`${base_url}/home`, {
      headers: {
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    loading("d-none");

    if (data.data.week.closed) {
      document.querySelector(".close-week").innerHTML = "فتح الاسبوع";
    } else {
      document.querySelector(".close-week").innerHTML = "اغلاق الاسبوع";
    }

    if (data.success) {
      displayData(data);
      globalWeekId = data.data.week.id;
    } else {
      console.log(data);
    }
  } catch (error) {
    loading("d-none");

    console.log(error);
  }
}

// STRTA FUNCTION DISPLAY (MAIN)
async function displayData(data) {
  console.log(data);

  titleDate.innerHTML = `جدول الاسبوع من <span><span>${data.data.week.startDate}</span></span> <br />   الي <span>${data.data.week.endDate}</span> `;
  dateNow = data.data.week.startDate;

  tableHead.innerHTML = `
              <tr class="align-middle">
                <th>الاسم</th>
                <th><span>${data.data?.days[0]?.dayName}</span> <br /><span>${data.data?.days[0]?.date.slice(5)}</span></th>
                <th><span>${data.data?.days[1]?.dayName}</span> <br /><span>${data.data?.days[1]?.date.slice(5)}</span></th>
                <th><span>${data.data?.days[2]?.dayName}</span> <br /><span>${data.data?.days[2]?.date.slice(5)}</span></th>
                <th><span>${data.data?.days[3]?.dayName}</span> <br /><span>${data.data?.days[3]?.date.slice(5)}</span></th>
                <th><span>${data.data?.days[4]?.dayName}</span> <br /><span>${data.data?.days[4]?.date.slice(5)}</span></th>
                <th><span>${data.data?.days[5]?.dayName}</span> <br /><span>${data.data?.days[5]?.date.slice(5)}</span></th>
                <th><span>${data.data?.days[6]?.dayName}</span> <br /><span>${data.data?.days[6]?.date.slice(5)}</span></th>
                <th>حساب الاسبوع</th>
                <th>اجراءات</th>
              </tr>
  `;

  let content = ``;

  // const weekEndDate = new Date(data.data?.week.endDate);

  // const today = new Date();
  // today.setHours(0, 0, 0, 0);

  // const isPastWeek = weekEndDate < today;
  // ${isPastWeek ? "disabled" : ""} // add all check boxs

  data.data.workers.forEach((data) => {
    content += `
             <tr >
                <td>${data.worker.name}</td>
                <td><input onchange="handelAttendance('${data?.worker?._id}' , '${data?.days[0]?.date}' , event)" ${data?.days[0]?.attended ? "checked" : ""}    type="checkbox" class="form-check-input" />
                <br />
                <span>${data?.days[0]?.wage ? data.days[0].wage : 0}</span>
                </td>
                <td><input onchange="handelAttendance('${data?.worker?._id}' , '${data?.days[1]?.date}' , event)" ${data?.days[1]?.attended ? "checked" : ""}   type="checkbox" class="form-check-input" />
                <br />
                <span>${data?.days[1]?.wage ? data.days[1].wage : 0}</span>
                </td>
                <td><input onchange="handelAttendance('${data?.worker?._id}' , '${data?.days[2]?.date}' , event)" ${data?.days[2]?.attended ? "checked" : ""}  type="checkbox" class="form-check-input" />
                <br />
                <span>${data?.days[2]?.wage ? data.days[2].wage : 0}</span>
                </td>
                <td><input onchange="handelAttendance('${data?.worker?._id}' , '${data?.days[3]?.date}' , event)" ${data?.days[3]?.attended ? "checked" : ""}  type="checkbox" class="form-check-input" />
                <br />
                <span>${data?.days[3]?.wage ? data.days[3].wage : 0}</span>
                </td>
                <td><input onchange="handelAttendance('${data?.worker?._id}' , '${data?.days[4]?.date}' , event)" ${data?.days[4]?.attended ? "checked" : ""}  type="checkbox" class="form-check-input" />
                <br />
                <span>${data?.days[4]?.wage ? data.days[4].wage : 0}</span>
                </td>
                <td><input onchange="handelAttendance('${data?.worker?._id}' , '${data?.days[5]?.date}' , event)" ${data?.days[5]?.attended ? "checked" : ""}  type="checkbox" class="form-check-input" />
                <br />
                <span>${data?.days[5]?.wage ? data.days[5].wage : 0}</span>
                </td>
                <td><input onchange="handelAttendance('${data?.worker?._id}' , '${data?.days[6]?.date}' , event)" ${data?.days[6]?.attended ? "checked" : ""}  type="checkbox" class="form-check-input" />
                <br />
                <span>${data?.days[6]?.wage ? data.days[6].wage : 0}</span>
                </td>
                <td id="total-${data?.worker?._id}">${data.summary?.net}</td>
                <td>
                  <button onclick="deleteWroker('${data.worker._id}')" class="btn btn-danger">حذف</button>
                  <a href="profile.html?id=${data.worker._id}" class="btn btn-primary">تفاصيل</a>
                </td>
              </tr>
   `;
  });

  tableBody.innerHTML = content;
}

// Start Function Add Worker From Api
btnAddWorker.addEventListener("click", addWrker);
async function addWrker(e) {
  const body = {
    name: addWorkerInput.value,
    currentWage: wage.value,
    weekStart: dateNow,
  };
  await fetchAddWorker(body);
}

async function fetchAddWorker(body) {
  try {
    const response = await fetch(`${base_url}/workers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    // ========= Start Toastify
    console.log(data);

    if (data.success) {
      toastify(`تم اضافه العامل   ${data.data.name}  بنجاح`, "#198754");
      colseModalOverlay();
      await getWeek();
    } else {
      console.log(data);

      toastify(data.error.message, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}
// GET WEEK BY DATE
btnViewWeek.addEventListener("click", getWeekByDate);
async function getWeekByDate() {
  const date = searchWeek.value;
  try {
    if (date) {
      const response = await fetch(`${base_url}/home/by-date?date=${date}`, {
        headers: {
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
          "X-Project-Id": localStorage.getItem("projectId"),
        },
      });
      const data = await response.json();

      if (data.success) {
        globalWeekId = data.data.week.id;

        displayData(data);
        if (data.data.week.closed) {
          document.querySelector(".close-week").innerHTM = "فتح الاسبوع";
        } else {
          document.querySelector(".close-week").innerHTM = "اغلاق الاسبوع";
        }
      } else {
        toastify("من فضلك قم بأدخال تاريخ صالح", "#dc3545");
        console.log(data);
      }
    } else {
      toastify("من فضلك قم بأدخال تاريخ صالح", "#dc3545");
      console.log(data);
    }
  } catch (error) {
    console.log(error);
    toastify("من فضلك قم بأدخال تاريخ صالح", "#dc3545");
  }
}

// START FUNCTION previous Week
btnPrev.addEventListener("click", previousWeek);
async function previousWeek() {
  try {
    const response = await fetch(`${base_url}/weeks/previous?from=${dateNow}`, {
      headers: {
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    if (data.success) {
      globalWeekId = data.data.week.id;
      if (data.data.week.closed) {
        document.querySelector(".close-week").innerHTM = "فتح الاسبوع";
      } else {
        document.querySelector(".close-week").innerHTM = "اغلاق الاسبوع";
      }

      displayData(data);
      searchWeek.value = dateNow;
      console.log(data);
    } else {
      console.log(data);
      toastify("الاسبوع غير موجود", "#dc3545");
    }
  } catch (err) {
    console.log(err);
  }
}
// STRAT FUNCTION NEXT WEEK
btnNext.addEventListener("click", nextWeek);
async function nextWeek() {
  try {
    const response = await fetch(`${base_url}/weeks/next?from=${dateNow}`, {
      headers: {
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    if (data.success) {
      globalWeekId = data.data.week.id;
      if (data.data.week.closed) {
        document.querySelector(".close-week").innerHTM = "فتح الاسبوع";
      } else {
        document.querySelector(".close-week").innerHTM = "اغلاق الاسبوع";
      }

      displayData(data);
      searchWeek.value = dateNow;
      console.log(data);
    } else {
      console.log(data);
      toastify("الاسبوع غير موجود", "#dc3545");
    }
  } catch (err) {
    console.log(err);
  }
}

// Start Function Attendance

async function handelAttendance(workerId, date, checkboxEle) {
  const isChecked = checkboxEle.target.checked;
  const status = isChecked ? "present" : "absent";
  const body = {
    date,
    status,
  };
  try {
    const response = await fetch(`${base_url}/workers/${workerId}/attendance`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (data.success) {
      toastify("تم تحديث حضور العمال بنجاح ", "#198754");
      console.log(data);
      document.getElementById(`total-${workerId}`).innerHTML =
        data.data.summary.net;

      // getWeek();
    } else {
      console.log(data);
      if (
        data.error.message == "A valid non-future date and status are required"
      ) {
        toastify("مضفش يوم لسه مجاش ممكن العامل يموت ", "#dc3545");
      } else {
        toastify("فشلت العمليه من فضلك اعد المحاوله", "#dc3545");
      }
      checkboxEle.target.checked = !isChecked;
    }
  } catch (error) {
    toastify("فشلت العمليه من فضلك اعد المحاوله", "#dc3545");
    console.log(error);

    checkboxEle.target.checked = !isChecked;
  }
}

// Function delete Worker

async function deleteWroker(workerId) {
  try {
    const result = confirm("هل تريد اتمام عمليه حذف العامل ");
    if (result) {
      const response = await fetch(`${base_url}/workers/${workerId}`, {
        method: "DELETE",
        headers: {
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
          "X-Project-Id": localStorage.getItem("projectId"),
        },
        body: {
          weekId: globalWeekId,
        },
      });
      const data = await response.json();

      if (data.success) {
        console.log(data);

        toastify(`تم حذف العامل بنجاح`, "#198754");
        // Call Function Get Week
        getWeek();
      }
    } else {
      toastify("لم يتم حذف العامل", "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}
// START CLOSE WEEK

document.querySelector(".close-week").addEventListener("click", async () => {
  let btnName =
    document.querySelector(".close-week").innerHTML == "فتح الاسبوع"
      ? (document.querySelector(".close-week").innerHTML = "اغلاق الاسبوع")
      : (document.querySelector(".close-week").innerHTML = "اغلاق الاسبوع"
          ? (document.querySelector(".close-week").innerHTML = "فتح الاسبوع")
          : document.querySelector(".close-week").innerHTML);
  try {
    const response = await fetch(`${base_url}/weeks/${globalWeekId}/close`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    // ========= Start Toastify

    if (data.success) {
      document.querySelector(".close-week").innerHTML = btnName;
      toastify(`تم تحديث حاله الاسبوع`, "#198754");
    }
  } catch (error) {
    console.log(error);
  }
});
