export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

export const PasswordRegexMessage = "Password must have at least one uppercase, one lowercase, one number, and one special character"

export const LeaveType = {
    SICK: 'sick leave',
    CASUAL: 'casual leave',
    ANNUAL: 'annual leave',
    STUDY: 'study leave',
    EXAM: 'exam leave',
    MATERNITY: 'maternity leave',
    PATERNITY: 'paternity leave',
    COMPASSIONATE: 'compassionate leave',
}

export const ENDPOINTS = {
    "CREATE_BUSINESS_ROLE": "createBusinessRole",
    "CREATE_BUSINESS_DEPARTMENT": "createBusinessDepartment",
    "CREATE_BUSINESS_EMPLOYEES": "createBusinessEmployees",
    "GET_BUSINESS_EMPLOYEES": "getBusinessEmployees",
    "ASSIGN_ROLE_TO_EMPLOYEE": "assignRoleToEmployee",
    "UNASSIGN_ROLE_TO_EMPLOYEE": "unassignRoleToEmployee",
    "ASSIGN_GRADE_TO_EMPLOYEE": "assignGradeToEmployee",
    "MAP_DEPARTMENT_TO_EMPLOYEE_MANAGERS": "mapDepartmentToEmployeeManagers",
    "UNMAPPED_DEPT": "unmappedDept",
    "ROLE_RESOURCE_MAPPING": "roleResourceMapping",
    "CREATE_LEAVE_CATEGORY": "createLeaveCategory",
    "DELETE_LEAVE_CATEGORY": "deleteLeaveCategory",
    "CREATE_GRADES": "createGrades",
    "UPDATE_GRADES": "updateGrades",
    "DELETE_GRADES": "deleteGrades",
    "ADMIN_CREATE_TASK": "adminCreateTask",
    "ASSIGN_TASK": "assignTask",
    "ADMIN_CREATE_TASK_DELIVERABLE": "adminCreateTaskDeliverable",
    "CREATE_PROJECT": "createProject",
    "CREATE_SPRINT": "createSprint"
}



export const CYCLESTATUS = {
    PENDING: 'pending',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    LOCKED: 'locked'
}
export const CYCLELOCKSTATUS = {
    LOCKED: 'locked',
    OPEN: 'open',
}

export const OBJECTIVESTATUS = {
    DRAFT: 'draft',
    ACTIVATE: 'active',
    REVIEW: 'reviewed'
}

export const MetricMeaseurement = {
    YESORNO: 'yes/no',
    CURRENCY: 'currency',
    NUMBER: 'number',
    RATINGSCALE: 'rating scale',
    PERCENTAGE: 'percentage'
}


export const CURRENCY = {
    USD: 'USD',
    NGN: 'NGN',
    GHANACEDI: 'GHC'
}


export const APP_ROLE = {
    'BUSINESS_SUPER_ADMIN': 'business-super-admin',
    'BUSINESS_GENERAL_USER': 'business-general-user',
    'BUSINESS_ADMIN': 'business-admin',
}


export const LEAVESTATUS = {
    PENDING: 'pending',
    APPROVE: 'approved',
    COMPLETED: 'completed',
    DECLINED: 'declined',
    CANCLED: 'cancled'
}
export const APPLICATIONSTAGES = {
    MANAGER: 'manager',
    HRM: 'hr',
    FINAL: 'final',
}

