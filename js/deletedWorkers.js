let base_url = "https://project-management-backend-jco6.onrender.com/api";
// const base_url = "http://localhost:5000/api";

addEventListener("DOMContentLoaded", getWorkersHidden);

async function getWorkersHidden() {
  loading("d-flex");
  try {
    const response = await fetch(`${base_url}/workers/hidden`, {
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    loading("none");

    if (data.success) {
      displayWorkers(data);
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading("d-none");
  }
}

function displayWorkers(data) {
  let content = ``;

  data.data.workers.forEach((worker) => {
    content += `
        <tr>
                <td>${worker.name}</td>
                <td>${worker.currentWage}</td>
                <td>
                  <a  href="profile.html?id=${worker._id}" class="btn btn-warning">عرض</a>
                  <button onclick="restorWorker('${worker._id}')" class="btn btn-success">استرجاع</button>
                  <button onclick="deleteWorker('${worker._id}')" class="btn btn-danger">حذف نهائي</button>
                </td>
              </tr>
    `;
  });

  document.querySelector(".table-worker").innerHTML = content;
}

async function restorWorker(workerId) {
  try {
    const response = await fetch(`${base_url}/workers/${workerId}/restore`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
    });
    const data = await response.json();
    if (data.success) {
      getWorkersHidden();
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteWorker(id) {
  const result = confirm("هل تريد اتمام عمليه حذف العال نهائيا ");

  if (result) {
    try {
      const response = await fetch(`${base_url}/workers/${id}/permanent`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
          "X-Project-Id": localStorage.getItem("projectId"),
        },
      });
      const data = await response.json();
      console.log(data);

      if (data.success) {
        toastify(data.message, "#198754");

        getWorkersHidden();
      } else {
        toastify("حدث خطأ", "#dc3545");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
