import { lazy } from "react";
import { Logout } from "../Logout";
import BusinessCreation from "../Pages/Configuration/BusinessCreation";

const ProjectDashboard = lazy(() => import("../Pages/TaskManagement/ProjectDashboard"))

const Sprint = lazy(() => import("../Pages/TaskManagement/SprintDashboard"))


const Departments = lazy(() => import("@src/Pages/Configuration/Departments"));

const Roles = lazy(() => import("@src/Pages/RolesPermissions/Roles"));

const Employees = lazy(() => import("@src/Pages/HrPages/Employee/Employees"));

const HrDashboard = lazy(() => import("@src/Pages/hrPages/HRDashBoard"));
const DailyDeliverables = lazy(() => import("@src/Pages/hrPages/DailyDeliverables"));
const Dashboard = lazy(() => import("@src/Pages/BusinessDashboard"));

const AdminCreateDeliverable = lazy(() =>
  import("@src/Pages/TaskManagement/AdminCreateDeliverable")
);
const AdminCreateTask = lazy(() =>
  import("@src/Pages/TaskManagement/AdminCreateTask")
);
const ChangeTaskStatus = lazy(() =>
  import("@src/Pages/TaskManagement/ChangeTaskStatus")
);
const UserUpdateDeliverable = lazy(() =>
  import("@src/Pages/TaskManagement/UserUpdateDeliverable")
);
const UserUpdateTask = lazy(() =>
  import("@src/Pages/TaskManagement/UserUpdateTask")
);
const TaskDashboard = lazy(() =>
  import("@src/Pages/TaskManagement/TaskDashboard")
);
const TaskDetails = lazy(() =>
  import("@src/Pages/TaskManagement/TaskDetails")
);
const CreateEmployee = lazy(() =>
  import("@src/Pages/HrPages/Employee/EmployeeCreation")
);
const CreateRole = lazy(() => import("../Pages/RolesPermissions/create-roles"));
const AssignRole = lazy(() => import("../Pages/RolesPermissions/assign-role"));
const UnassignRole = lazy(() => import("../Pages/RolesPermissions/unassign-role"));
const MapResources = lazy(() =>
  import("@src/Pages/Configuration/Resources/MapResources")
);
// const UnMapResources = lazy(() =>
//   import("@src/Pages/Configuration/Resources/UnMapResources")
// );
const DepartmentManager = lazy(() =>
  import("@src/Pages/Configuration/DepartmentManagers/DepartmentManager")
);
const UnAssignDepartmentManager = lazy(() =>
  import("@src/Pages/Configuration/DepartmentManagers/UnassignDepartmentManager")
);
const Requisition = lazy(() => import("@src/Pages/HrPages/Requisitions/Requisition"));

const coreRoutes = [
  {
    path: "/dashboard",
    title: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/hrDashboard",
    title: "HR Dashboard",
    component: HrDashboard,
  },
  {
    path: "/tasks/:id",
    title: "Porject Management",
    component: TaskDashboard,
  },

  {
    path: "/task/:id",
    title: "Task Details",
    component: TaskDetails,
  },

  {
    path: "/make/requisition",
    title: "Requisition",
    component: Requisition,
  },

  {
    path: "/project/dashboard",
    title: "projects-dashboard",
    component: ProjectDashboard,
  },

  {
    path: '/sprints/:id',
    title: "Sprint-dashboard",
    component: Sprint,
  },

  {
    path: "/user/update/task/deliverable",
    title: "Task Deliverable Updates",
    component: UserUpdateDeliverable,
  },
  {
    path: "/user/update/task",
    title: "Update Task",
    component: UserUpdateTask,
  },
  {
    path: "/admin/create/task/:id",
    title: "Create Task",
    component: AdminCreateTask,
  },
  {
    path: "/admin/create/task/deliverable",
    title: "Create Deliverable",
    component: AdminCreateDeliverable,
  },
  {
    path: "/change/task/status",
    title: "Change Task Status",
    component: ChangeTaskStatus,
  },

  {
    path: "/create-business",
    title: "Create Business",
    component: BusinessCreation,
  },
  {
    path: "/hr/employees",
    title: "Employees",
    component: Employees,
  },
  {
    path: "hr/create/employees",
    title: "Create Employee",
    component: CreateEmployee,
  },
  {
    path: "/create/business/role",
    title: "Create Role",
    component: CreateRole,
  },
  {
    path: "/config/assign/role",
    title: "Assign Role",
    component: AssignRole,
  },
  {
    path: "/config/unassign/role",
    title: "Unassign Role",
    component: UnassignRole,
  },

  {
    path: "/config/api/resources",
    title: "Map API Resource With Role",
    component: MapResources,
  },

  // {
  //   path: "/unmap/api/resource",
  //   title: "Un Map Resource To Role",
  //   component: UnMapResources,
  // },

  {
    path: "/config/departments",
    title: "Departments",
    component: Departments,
  },



  {
    path: "/config/departments/managers",
    title: "Department Managers",
    component: DepartmentManager,
  },

  {
    path: "/unmapped/dept",
    title: "UnAssign Department Managers",
    component: UnAssignDepartmentManager,
  },

  {
    path: "/config/roles",
    title: "Roles",
    component: Roles,
  },

  {
    path: "/logout",
    title: "Logout",
    component: Logout,
  },

  {
    path: "/hr/daily/deliverables",
    title: "Daily Deliverables",
    component: DailyDeliverables,
  },


];

const routes = [...coreRoutes];

export default routes;
