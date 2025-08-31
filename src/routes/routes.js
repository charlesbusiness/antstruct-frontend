import { lazy } from "react";
import { Logout } from "../Logout";
import BusinessCreation from "../Pages/Configuration/BusinessCreation";

const ProjectDashboard = lazy(() =>
  import("../Pages/TaskManagement/ProjectDashboard")
);

const Sprint = lazy(() => import("../Pages/TaskManagement/SprintDashboard"));

const Departments = lazy(() => import("@src/Pages/Configuration/Departments"));

const Roles = lazy(() => import("@src/Pages/RolesPermissions/Roles"));

const Employees = lazy(() => import("@src/Pages/HrPages/Employee/Employees"));

const HrDashboard = lazy(() => import("@src/Pages/HrPages/HRDashBoard"));
const DailyDeliverables = lazy(() =>
  import("@src/Pages/HrPages/DailyDeliverables")
);
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
const TaskDetails = lazy(() => import("@src/Pages/TaskManagement/TaskDetails"));

const AssignRole = lazy(() => import("../Pages/RolesPermissions/assign-role"));

const MapResources = lazy(() =>
  import("@src/Pages/Configuration/Resources/MapResources")
);
const DepartmentManager = lazy(() =>
  import("@src/Pages/Configuration/DepartmentManagers/DepartmentManager")
);
const UnAssignDepartmentManager = lazy(() =>
  import(
    "@src/Pages/Configuration/DepartmentManagers/UnassignDepartmentManager"
  )
);
const Requisition = lazy(() =>
  import("@src/Pages/HrPages/Requisitions/Requisition")
);
const payroll = lazy(() => import("@src/Pages/HrPages/Payroll/Payroll"));

const Appraisal = lazy(() =>
  import("@src/Pages/HrPages/PerformanceCycle/CycleManager/Appraisal")
);

const PerformanceDashboard = lazy(() =>
  import("@src/Pages/HrPages/Performance/Objectives/PerformanceObjectiveDashboard")
);
const ObjectiveData = lazy(() =>
  import("@src/Pages/HrPages/Performance/Objectives/ObjectiveData")
);

const organizationChart = lazy(() =>
  import("@src/Pages/HrPages/OrgChart/OrganizationChart")
);
const policies = lazy(() => import("@src/Pages/HrPages/Policies/Policies"));
const training = lazy(() => import("@src/Pages/HrPages/Training/Training"));
const LeaveRequest = lazy(() => import("@src/Pages/HrPages/Leave/LeaveRequest"));
const LeavePolicies = lazy(() =>
  import("@src/Pages/HrPages/Leave/LeavePolicies")
);
const Grades = lazy(() => import("@src/Pages/HrPages/Leave/CreateGrades"));
const Inventory = lazy(() => import("@src/Pages/Inventory"));
const StockMovement = lazy(() => import("@src/Pages/Inventory/StockMovement"));
const Supplier = lazy(() => import("@src/Pages/Inventory/Supplier"));
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
    title: "Tasks Management",
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
    title: "Projects Dashboard",
    component: ProjectDashboard,
  },

  {
    path: "/sprints/:id",
    title: "Sprint Dashboard",
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
    path: "/config/assign/role",
    title: "Assign Role",
    component: AssignRole,
  },

  {
    path: "/config/api/resources",
    title: "Map API Resource With Role",
    component: MapResources,
  },

  {
    path: "/payroll",
    title: "Payroll",
    component: payroll,
  },

  {
    path: "/performace",
    title: "Performace",
    component: Appraisal,
  },

  {
    path: "/objectives",
    title: "Objective",
    component: ObjectiveData,
  },

  {
    path: "/reviews",
    title: "Performance Review",
    component: PerformanceDashboard,
  },

  {
    path: "/policies",
    title: "Policies",
    component: policies,
  },
  {
    path: "/leave",
    title: "Leave Request",
    component: LeaveRequest,
  },
  {
    path: "/training",
    title: "Training",
    component: training,
  },
  {
    path: "/org-chart",
    title: "Organizational Chart",
    component: organizationChart,
  },

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
    path: "/hr/leave-policies",
    title: "Leave Policies",
    component: LeavePolicies,
  },
  {
    path: "/hr/grades",
    title: "Grades",
    component: Grades,
  },
  {
    path: "/inventory",
    title: "Inventory",
    component: Inventory,
  },

  {
    path: "/inventory/suppliers",
    title: "Suppliers ",
    component: Supplier,
  },

  {
    path: "/inventory/product-stocks",
    title: " Stock Movement",
    component: StockMovement,
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
