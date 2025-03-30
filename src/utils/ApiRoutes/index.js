export const ApiRoutes = {


  authentication: {
    register: 'user/register',
    login: 'user/login',
    verifyAccount: 'user/verify',
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
    businessProfile: 'config/business/profile'
  },

  employees: {
    create: 'config/business/employees',
    getEmployees: 'config/business/employees',
    assignRole: 'config/business/employees/roles',
    getAssignedRole: 'config/business/employees/roles',
  },

  employeeResourceMap: {
    map: 'role/resources',
    getMapped: 'role/resources',
  }
}