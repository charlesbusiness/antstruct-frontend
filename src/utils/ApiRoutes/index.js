export const ApiRoutes = {

  authentication: {
    register: 'user/register',
    login: 'user/login',
    verifyAccount: 'user/verify',
    resendVeirificationCode: 'user/resend/code',
    resendVerificationCode: 'user/resend/code',
    sendForgotPassword: 'account/recovery/email',
    resetPassword: 'account/recovery/reset/password',
    verifyAccountRecoveryOtp: 'account/recovery/verify/otp',
  },

  admin: {
    apiResources: {
      create: 'admin/endpoints',
      get: 'admin/endpoints',
    },

    authentication: {
      register: 'admin/register',
      register: 'admin/login',
    }
  },


  business: {
    getCategory: 'config/business/categories',
    size: 'config/business/sizes',
    create: 'config/business/create',
    roles: 'config/business/role',
    createRoles: 'config/business/role',
    createDepartment: 'config/business/department',
    getDepartments: 'config/business/department',
    businessProfile: 'config/business/profile',
    apiResources: {
      publicApis: 'config/business/public/resources',
      moduleResources: 'config/business/public/module-resources',
      appModules: 'config/business/public/modules'
    }
  },

  employees: {
    create: 'config/business/employees',
    getEmployees: 'config/business/employees',
    assignRole: 'config/business/employees/roles',
    removeAssignRole: 'config/business/employees/roles',
    getAssignedRole: 'config/business/employees/roles',
  },

  employeeResourceMap: {
    map: 'config/business/role/resources/map',
    getMapped: 'config/business/role/resources/map',
    unmapResource: 'config/business/role/resources/map/unmap',
  },

  employeeDeptMap: {
    map: 'config/business/employees/department/map',
    getMapped: 'config/business/employees/department/map',
    unmapDept: 'config/business/employees/department/map',
  },

  tasks: {
    create: 'tasks/admin',
    tasks: (query, sprint) => `tasks/admin/tasks?sprint=${sprint}`,
    task: (id) => `tasks/admin/task/${id}`,
    taskUpdate: (id) => `tasks/admin/task/status/${id}`,
    deliverableUpdate: `tasks/admin/deliverable/status`,
  },

  projects: {
    create: 'projects',
    createSprint: 'projects/sprint',
    projects: 'projects',
    sprints: (projectId) => `projects/sprint/${projectId}`
  },

  remarks: {
    create: 'tasks/admin/deliverable/remark',
    // tasks: (query) => `tasks/admin/tasks?${query}`,
    // task: (id) => `tasks/admin/task/${id}`
  },

  deliverables: {
    create: 'tasks/admin/deliverables'
  },

  requisitions: {
    make: 'requisitions/make',
    approve: (id) => `requisitions/approve/${id}`,
    review: 'requisitions/review',
    cancel: 'requisitions/cancel',
    requisitions: 'requisitions',
    requisition: (id) => `requisitions/${id}`,
  },

  hrManager: {
    deliverables: {
      create: 'hr/manager/deliverables/create',
      update: 'hr/manager/deliverables/update',
      get: 'hr/manager/deliverables',
    }
  }
}