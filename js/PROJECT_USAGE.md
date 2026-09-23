# ربط الـ Frontend بالمشاريع

بعد تسجيل الدخول، احفظ المشروع المختار:

```js
localStorage.setItem("active_project_id", projectId);
```

واستخدم `authFetch` بدل `fetch` في صفحات المشروع. سيتم إرسال:
- X-Username
- X-Login-Key
- X-Project-Id

تلقائيًا.

لتحميل المشاريع:
```js
import { loadProjects, openProject } from "./project-client.js";
const projects = await loadProjects();
await openProject(projects[0]._id);
```

لإنشاء مشروع:
```js
import { createProject } from "./project-client.js";
await createProject({ name: "مشروع جديد", code: "P-02", description: "..." });
```
