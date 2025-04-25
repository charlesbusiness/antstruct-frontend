import { lazy } from "react";
import { Logout } from "../Logout";

const CreateBusiness = lazy(() =>
  import("../components/business_creation/BusinessCreation")
);


const Departments = lazy(() =>
  import("../components/Pages/Departments")
);

const Roles = lazy(() =>
  import("../components/Pages/Roles")
);

const Employees = lazy(() =>
  import("../components/Pages/Employees")
);
const CreateDepartment = lazy(() =>
  import("../components/dept_creation/DepartmentCreation")
);
const Dashboard = lazy(() => import("../components/Pages/BusinessDashboard"));
const AdminCreateDeliverable = lazy(() => import("../components/Task_Management/AdminCreateDeliverable")); 
const AdminCreateTask = lazy(() => import("../components/Task_Management/AdminCreateTask")); 
const ChangeTaskStatus = lazy(() => import("../components/Task_Management/ChangeTaskStatus"));
const UserUpdateDeliverable = lazy(() => import("../components/Task_Management/UserUpdateDeliverable")); 
const UserUpdateTask = lazy(() => import("../components/Task_Management/UserUpdateTask"));
const TaskDashboard = lazy(() => import("../components/Task_Management/TaskDashboard"));
const CreateEmployee = lazy(() =>
  import("../components/employee_creation/EmployeeCreation")
);
const CreateRole = lazy(() =>
  import("../components/role/create-roles")
);
const AssignRole = lazy(() => import("../components/role/assign-role"));
const UnassignRole = lazy(() => import("../components/role/unassign-role"));
const MapResources = lazy(() => import("../components/map_resources_to_roles/MapResources"));
const UnMapResources = lazy(() => import("../components/map_resources_to_roles/UnMapResources"));
const DepartmentManager = lazy(() => import("../components/map_dept_managers/DepartmentManager"));
const UnAssignDepartmentManager = lazy(() => import("../components/map_dept_managers/UnassignDepartmentManager"));

const coreRoutes = [
  {
    path: "/dashboard",
    title: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/task/dashboard",
    title: "Task Dashboard",
    component: TaskDashboard,
  },
  {
    path: "/user/update/task/deliverable",
    title: "Update Task Deliverable",
    component: UserUpdateDeliverable,
  },
  {
    path: "/user/update/task",
    title: "Update Task",
    component: UserUpdateTask,
  },
  {
    path: "/admin/create/task",
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
    path: "/employees",
    title: "Employees",
    component: Employees,
  },
  {
    path: "/create/business/department",
    title: "Create Department",
    component: CreateDepartment,
  },
  {
    path: "/create-business",
    title: "Create Business",
    component: CreateBusiness,
  },
  {
    path: "/create/business/employees",
    title: "Create Employee",
    component: CreateEmployee,
  },
  {
    path: "/create/business/role",
    title: "Create Role",
    component: CreateRole,
  },
  {
    path: "/assign/role/to/employee",
    title: "Assign Role",
    component: AssignRole,
  },
  {
    path: "/unassign/role/to/employee",
    title: "Unassign Role",
    component: UnassignRole,
  },

  {
    path: "/role/resource/mapping",
    title: "Map Resource To Role",
    component: MapResources,
  },

  {
    path: "/unmap/api/resource",
    title: "Un Map Resource To Role",
    component: UnMapResources,
  },

  {
    path: "/departments",
    title: "Departments",
    component: Departments,
  },

  {
    path: "/map/department/to/employee/managers",
    title: "Department Managers",
    component: DepartmentManager,
  },
  {
    path: "/unmapped/dept",
    title: "UnAssign Department Managers",
    component: UnAssignDepartmentManager,
  },

  {
    path: "/roles",
    title: "Roles",
    component: Roles,
  },

  {
    path: "/logout",
    title: "Logout",
    component: Logout,
  },

];

const routes = [...coreRoutes];

export default routes;
