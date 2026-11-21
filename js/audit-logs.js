// const base_url = "http://localhost:5000/api";
const base_url = "https://project-management-backend-jco6.onrender.com/api";

const tableAcounts = document.querySelector(".tableAcounts");

async function getAuditLogs() {
  try {
    const response = await fetch(`${base_url}/audit-logs`, {
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
      displayAuditLogs(data);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
}
function displayAuditLogs(data) {
  let acountInfo = "";
  data.data.items.reverse();
  data.data.items.forEach((item, index) => {
    acountInfo += `
        <tr class="">
                <td>${index + 1}</td>
                <td>${item._id}</td>
                <td>${item.action}</td>
                <td>${item.actorName}</td>
                <td>${item.createdAt}</td>
                <td>${item.userAgent}</td>
                <td>${item.statusCode}</td>
                
              </tr>
        `;
  });
  tableAcounts.innerHTML = acountInfo;
}

// call function display getAuditLogs
getAuditLogs();
