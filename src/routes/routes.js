import { lazy } from "react";
import { Logout } from "../Logout";

const CreateBusiness = lazy(() =>
  import("../components/business_creation/BusinessCreation")
);


const Departments = lazy(() =>
  import("../components/Pages/Departments")
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
  import("../components/employee_role/employee_role")
);
const AssignRole = lazy(() => import("../components/assign_role/AssignRole"));
const MapResources = lazy(() => import("../components/map_resources_to_roles/MapResources"));

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
    path: "/create-department",
    title: "Create Department",
    component: CreateDepartment,
  },
  {
    path: "/create-business",
    title: "Create Business",
    component: CreateBusiness,
  },
  {
    path: "/create-employee",
    title: "Create Employee",
    component: CreateEmployee,
  },
  {
    path: "/create-role",
    title: "Create Role",
    component: CreateRole,
  },
  {
    path: "/assign-role",
    title: "Assign Role",
    component: AssignRole,
  },
  {
    path: "/departments",
    title: "Departments",
    component: Departments,
  },

  {
    path: "/logout",
    title: "Logout",
    component: Logout,
  },
];

const routes = [...coreRoutes];

export default routes;
