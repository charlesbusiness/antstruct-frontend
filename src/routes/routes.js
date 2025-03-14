import { lazy } from "react";
import Employees from "../components/Pages/Employees";
const CreateBusiness = lazy(() =>
  import("../components/business_creation/BusinessCreation")
);
const CreateDepartment = lazy(() =>
  import("../components/dept_creation/DepartmentCreation")
);
const Dashboard = lazy(() => import("../components/Pages/Home"));
const CreateEmployee = lazy(() =>
  import("../components/employee_creation/EmployeeCreation")
);
const CreateRole = lazy(() =>
  import("../components/employee_role/employee_role")
);
const AssignRole = lazy(() => import("../components/assign_role/AssignRole"));

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
];

const routes = [...coreRoutes];

export default routes;
