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
    tasks: (query) => `tasks/admin/tasks?${query}`,
    task: (id) => `tasks/admin/task/${id}`
  },
  deliverables: {
    create: 'tasks/admin/deliverables',
    // tasks: (query) => `tasks/admin/tasks?${query}`,
    // task: (id) => `tasks/admin/task/${id}`
  }
}