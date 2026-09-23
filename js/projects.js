const row = document.querySelector(".row");
const btnOpenOverlay = document.querySelector("#open-overlay");
const OpenOverlayEdit = document.querySelector(".overlay-edit-project");
const btnCloseOverlayEdit = document.querySelector(
  ".btn-exit-overlay-edit-project",
);
const btnCloseOverlay = document.querySelector("#close-overlay");
const overlayAddProject = document.querySelector(".overlay-add-project");
const projectName = document.querySelector(".projectName");
const projectDecs = document.querySelector(".projectDecs");
const projectStatu = document.querySelector(".projectStatu");
const projectDate = document.querySelector(".projectDate");
const btnAddProject = document.querySelector(".btnAddProject");
const base_url = "http://localhost:5000/api";
let ProjectId = null;

// التحقق من صلاحيه المستخدم
addEventListener("DOMContentLoaded", verifyAuth);
addEventListener("DOMContentLoaded", getAllProjects);

// GET ALL PROJECTS FROM API

async function getAllProjects() {
  loading("d-flex");

  try {
    const response = await fetch(`${base_url}/projects`, {
      headers: {
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
      },
    });
    const data = await response.json();
    loading("d-none");

    if (data.success) {
      displaayProjects(data);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading("d-none");
  }
}

// START FUNCTION DISPLAY PROJECTS
function displaayProjects(data) {
  let content = "";
  data.data.forEach((project) => {
    content += `
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card project">
          <div class="card-header border-bottom py-2">
            <h5 class="card-title">
              <span>اسم المشروع :</span>
              <span> ${project.name} </span>
            </h5>
          </div>
          <div class="card-body">
            <div class="date border-bottom py-2">
              <h6>تاريخ بدء المشروع : ${project.startedAt}</h6>
              <h6>تاريخ الانتهاء : ${project.endedAt == null ? "تحت التنفيذ" : project.endedAt}</h6>
            </div>
            <div class="status border-bottom py-2 d-flex align-items-center">
              <h6>حاله المشروع : </h6>
              <h6 class="p-1 rounded text-light ${project.status == "active" ? "active" : "bg-danger"}">${project.status == "active" ? " نشط " : " منتهي "}</h6>
            </div>
            <div class="desc mb-2">
              <strong> نبذه عن المشروع </strong>
              <p class="card-text">
               ${project.description}
              </p>
            </div>
            <div class="border-top pt-2 d-flex align-items-center gap-2">
              <a href="index.html?id=${project._id}" class="btn btn-success">
                دخول
              </a>
              <a href="project-details.html?id=${project._id}" class="btn btn-info">تفاصيل</a>
              <button onclick="openOverlayProjectEdit('${project.name}' , '${project.status}' , ' ${project.description}' , '${project._id}' )" class="btn btn-warning">تعديل</button>
              <button onclick="deletedProject('${project._id}')" class="btn btn-danger">حذف</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  row.innerHTML = content;
}

// FUNCTION OPEN OVERLAY ADD PROJECT
btnOpenOverlay.addEventListener("click", openOverlayProject);
function openOverlayProject() {
  overlayAddProject.classList.add("open-overlay");
  overlayAddProject.classList.remove("close-overlay");
}

// FUNCTION CLOSE OVERLAY ADD PROJECT
btnCloseOverlay.addEventListener("click", closeOverlayProject);
function closeOverlayProject() {
  overlayAddProject.classList.remove("open-overlay");
  overlayAddProject.classList.add("close-overlay");
}

// FUNCTION CLOSE OVERLAY EDIT PROJECT
btnCloseOverlayEdit.addEventListener("click", closeOverlayProjectEdit);
function closeOverlayProjectEdit() {
  OpenOverlayEdit.classList.remove("open-overlay");
  OpenOverlayEdit.classList.add("close-overlay");
}

// STRATR ADD PROJECTS
btnAddProject.addEventListener("click", addProject);
const inputName = document.querySelector(".inputName");
const inputDesc = document.querySelector(".inputDesc");
async function addProject() {
  const body = {
    name: inputName.value,
    description: inputDesc.value,
  };
  await fetchAddProjects(body);
}
async function fetchAddProjects(body) {
  try {
    const response = await fetch(`${base_url}/projects`, {
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
    console.log(data);

    if (data.success) {
      toastify(`تم اضافه المشروع بنجاح`, "#198754");
      getAllProjects();
      closeOverlayProject();
    } else {
      console.log(data);

      toastify("من فضلك ادخل البيانات  بشكل صحيح", "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}

// FUNCTION OPEN OVERLAY EDIT PROJECT
function openOverlayProjectEdit(name, statu, desc, id) {
  OpenOverlayEdit.classList.add("open-overlay");
  OpenOverlayEdit.classList.remove("close-overlay");
  projectName.value = name;
  projectDecs.value = desc;
  projectStatu.value = statu;
  ProjectId = id;
}

// EDIT PROJECT
const btnEditProject = document.querySelector(".btnEditProject");
btnEditProject.addEventListener("click", fetchEditProjects);
async function fetchEditProjects() {
  try {
    const response = await fetch(`${base_url}/projects/${ProjectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Username": JSON.parse(localStorage.getItem("info")).username,
        "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        "X-Project-Id": localStorage.getItem("projectId"),
      },
      body: JSON.stringify({
        name: projectName.value,
        description: projectDecs.value,
        status: projectStatu.value,
      }),
    });
    const data = await response.json();
    console.log(data);

    if (data.success) {
      toastify(`تم تعديل المشروع بنجاح`, "#198754");
      getAllProjects();
      closeOverlayProjectEdit();
    } else {
      console.log(data);

      toastify("من فضلك ادخل البيانات  بشكل صحيح", "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}

// STARAT FUNCTION DELETE PROJECT
async function deletedProject(id) {
  if (confirm("هل انت متأكد من حذف المشروع نهائيا")) {
    try {
      const response = await fetch(`${base_url}/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        },
      });
      const data = await response.json();

      if (data.success) {
        toastify(`تم حذف المشروع بنجاح`, "#198754");
        getAllProjects();
      } else {
        toastify("فشلت المهمه اعد المحاوله", "#dc3545");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    toastify(`تم الغاء العمليه`, "#198754");
  }
}
