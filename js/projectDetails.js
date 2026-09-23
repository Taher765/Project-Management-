const logo = document.querySelector(".logo");
const projectInfo = document.querySelector(".projectInfo");
const workers = document.querySelector(".workers");
const cost = document.querySelector(".cost");
const base_url = "https://project-management-backend-jco6.onrender.com/api";

const params = new URLSearchParams(window.location.search);
let projectId = params.get("id");
let containerSheet = [];

// التحقق من صلاحيه المستخدم
addEventListener("DOMContentLoaded", verifyAuth);
addEventListener("DOMContentLoaded", getProject);

// STRAT FUNCTION GET PROJECT
addEventListener("DOMContentLoaded", getProject);
async function getProject() {
  loading("d-flex");
  try {
    const response = await fetch(
      `${base_url}/projects/${projectId}/dashboard`,
      {
        headers: {
          "X-Username": JSON.parse(localStorage.getItem("info")).username,
          "X-Login-Key": JSON.parse(localStorage.getItem("info")).loginKey,
        },
      },
    );
    const data = await response.json();
    loading("d-none");
    displaayProjects(data);
    containerSheet = data;
    console.log(data);
  } catch (error) {
    loading("d-none");
    console.log(error);
  }
}

// START FUNCTION DISPLAY PROJECTS
function displaayProjects(data) {
  logo.innerHTML = data.data.project.name;
  projectInfo.innerHTML = `
          <h3>
            ${data.data.project.description}
          </h3>
          <h5>بدايه المشروع : ${data.data.project.startedAt}</h5>
          <h5>نهايه المشروع : ${data.data.project.endedAt == null ? "تحت التنفيذ" : data.data.project.endedAt}</h5>
          <h6> حاله المشروع : ${data.data.project.status == "active" ? "نشط" : "منتهي"} </h6>
  
  `;

  workers.innerHTML = `
      
  <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5>  مستحقات العمال قبل الخصم و المكافأت </h5>
              <h5>${data.data.financial.workerGrossEarned}</h5>
            </div>
          </div>

       

        

          <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5> اجمالي الخصم </h5>
              <h5>${data.data.financial.transactionDeductions + data.data.financial.dailyDeductions}</h6>
            </div>
          </div>

          <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5> اجمالي المكافأت </h5>
              <h5>${data.data.financial.rewards}</h5>
            </div>
          </div>

             <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5>مستحقات العمال </h5>
              <h5>${data.data.financial.workerCost}</h5>
            </div>
          </div>

          <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5> المدفوع  </h5>
              <h5>${data.data.financial.workerPaid}</h5>
            </div>
          </div>

          <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5> المتبقي  </h5>
              <h5>${data.data.financial.workerRemaining}</h5>
            </div>
          </div>
`;

  cost.innerHTML = `

          <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5>الايرادات  </h5>
              <h5>${data.data.financial.revenue}</h5>
            </div>
          </div>

          <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5>مصاريف الشغل</h5>
              <h5>${data.data.financial.otherExpenses}</h5>
            </div>
          </div>

          <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5>اجمالي مصروفات المشروع</h5>
              <h5>${data.data.financial.totalSpent}</h5>
            </div>
          </div>

          <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5> اجمالي الربح او الخساره </h5>
              <h5>${data.data.financial.profit}</h5>
            </div>
          </div>

          <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5>عدد المستخلصات</h5>
              <h5>${data.data.financial.receiptsCount}</h5>
            </div>
          </div>

          <div  class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="border p-2 rounded text-center">
              <h5>عدد الاسابيع </h5>
              <h5>${data.data.financial.weeksCount}</h5>
            </div>
          </div>



`;
}

document.querySelector(".export").addEventListener("click", exportSheet);
function exportSheet() {
  console.log(containerSheet.data);

  const pureArr = [
    {
      "اسم المشروع ": `${containerSheet.data.project.name}`,
      "مده المشروع": `${containerSheet.data.project.startedAt} - ${
        containerSheet.data.project.startedAt
      } `,
      "معلومات المشروع": containerSheet.data.project.description,
      "  حاله المشروع ": containerSheet.data.project.status,
      " تكاليف العمال  ": containerSheet.data.financial.workerCost,
      "   المدفوع  ": containerSheet.data.financial.workerPaid,
      "  المتبقي   ": containerSheet.data.financial.workerRemaining,
      "  الايرادات   ": containerSheet.data.financial.revenue,
      "  مصاريف الشغل   ": containerSheet.data.financial.otherExpenses,
      "  اجمالي مصروفات المشروع عمال و مصروفات   ":
        containerSheet.data.financial.totalSpent,
      " صافي المشروع ربح او خساره ": containerSheet.data.financial.profit,
      " عدد المسخلصات ": containerSheet.data.financial.receiptsCount,
      " عدد الاسابيع ": containerSheet.data.financial.weeksCount,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(pureArr);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    `ملخص مشروع ${containerSheet.data.project.name} `,
  );
  XLSX.writeFile(
    workbook,
    `ملخص مشروع   ${containerSheet.data.project.name}.xlsx`,
  );
}
