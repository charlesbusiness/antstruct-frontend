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
      get: (publicStatus) => `admin/endpoints?is_public=${publicStatus}`,
    },

    authentication: {
      register: 'admin/register',
      login: 'admin/login',
    }
  },


  business: {
    getCategory: 'config/business/categories',
    size: 'config/business/sizes',
    create: 'config/business/create',
    roles: 'config/business/role',
    platformRoles: 'config/roles',
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
    assignGrade: (id) => `config/business/employees/grade/${id}`,
    create: 'config/business/employees',
    getEmployees: 'config/business/employees',
    assignRole: 'config/business/employees/roles',
    removeAssignRole: 'config/business/employees/roles',
    getAssignedRole: 'config/business/employees/roles',
    department: (department) => `config/business/employees/department/data/${department}`,
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
    assignTask: `tasks/admin/assign`,
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
    review: (id) => `requisitions/review/${id}`,
    cancel: 'requisitions/cancel',
    requisitions: 'requisitions',
    requisition: (id) => `requisitions/${id}`,
  },

  hrManager: {
    deliverables: {
      create: 'hr/manager/deliverables/create',
      update: (id) => `hr/manager/deliverables/update/${id}`,
      get: (search) => `hr/manager/deliverables?${search}`,
    },

    leave: {
      category: {
        create: 'hr/manager/leave/category',
        get: 'hr/manager/leave/category',
        delete: (id) => `hr/manager/leave/category/${id}`,
      },
      applications: {
        apply: 'leave/manager/apply',
        update: (leave) => `leave/manager/apply/${leave}`,
        leaves: 'leave/manager/apply/leaves'
      }
    },

    grades: {
      create: 'hr/manager/employment/grade',
      get: 'hr/manager/employment/grade',
      delete: (id) => `hr/manager/employment/grade/${id}`,
      update: (id) => `hr/manager/employment/grade/${id}`,
    },
  },

  performanceManager: {
    cycle: {
      create: 'performance/manager/cycles',
      update: (id) => `hr/manager/deliverables/update/${id}`,
      get: 'performance/manager/cycles',
    },

    quarters: {
      create: 'performance/manager/quarters',
    },

    reviews: {
      startReview: 'performance/manager/reviews',
    },

    objectives: {
      create: 'performance/manager/objectives',
      update: (id) => `performance/manager/objectives/${id}`,
      changeStatus: (id) => `performance/manager/objectives/status/${id}`,
      getObjectives: (employee, cycleId) => {
        let url = 'performance/manager/objectives'
        if (employee) url = url.concat(`/${employee}`)
        if (cycleId) url = url.concat(`?cycle_id=${cycleId}`)
        return url
      },
    },
  }
}