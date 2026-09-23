const base_url = "https://project-management-backend-jco6.onrender.com/api";

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
