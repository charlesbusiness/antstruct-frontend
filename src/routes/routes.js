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
