const allUsersLink = document.querySelector(".allUsersLink");
const devRole = document.querySelector(".devRole");
const auditLogs = document.querySelector(".audit-logs");

function editLayout() {
  if (JSON.parse(localStorage.getItem("info")).role != "admin") {
    allUsersLink.classList.add("d-none");
    if (auditLogs) {
      auditLogs.classList.add("d-none");
    }
    if (devRole) {
      devRole.classList.add("d-none");
    }
  }
}

editLayout();
