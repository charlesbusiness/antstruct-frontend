import { ApiRoutes } from "../utils/ApiRoutes"

export const getDepartments = async (submitData) => {
    const response = await submitData({
        data: {},
        endpoint: ApiRoutes.configuration.departments,
        method: 'get'
    })
    return response?.data
}
export const departmentData = async (submitData, department) => {
    const response = await submitData({
        data: {},
        endpoint: ApiRoutes.employees.department(department),
        method: 'get'
    })
    return response?.data
}

export const getRoles = async (submitData) => {
    const response = await submitData({
        data: {},
        endpoint: ApiRoutes.configuration.roles,
        method: 'get'
    })
    return response?.data
}

export const leaveCategory = async (submitData) => {
    const response = await submitData({
        data: {},
        endpoint: ApiRoutes.configuration.getLeaveCategories,
        method: 'get'
    })
    return response?.data
}


export const getHolidays = async (submitData) => {
    const response = await submitData({
        data: {},
        endpoint: ApiRoutes.configuration.holidays.get,
        method: 'get'
    })
    return response?.data
}

export const attendanceSettingData = async (submitData) => {
    const response = await submitData({
        data: {},
        endpoint: ApiRoutes.configuration.attendance.get,
        method: 'get',
    })
    return response?.data
}


export const getEmployees = async (submitData, page, size = 10, searchTerm) => {

    const { data } = await submitData({
        endpoint: ApiRoutes.authentication.employees(page, size, searchTerm),
        method: 'get',
        reload: false
    })
    return data;
}

export const getAllLeaveRequests = async (submitData, page, size = 10, status, searchTerm) => {

    const { data } = await submitData({
        endpoint: ApiRoutes.leave.allLeaveRequests(page, size, status, searchTerm),
        method: 'get',
        reload: false
    })
    return data;
}
export const getLeaveRedemptions = async (submitData, page, size = 10, searchTerm) => {

    const { data } = await submitData({
        endpoint: ApiRoutes.leave.leaveRedemptions(page, size, searchTerm),
        method: 'get',
        reload: false
    })
    return data;
}


export const getEmployeesData = async (submitData, id = null, query) => {

    const { data } = await submitData({
        endpoint: ApiRoutes.employees.employees(id, query),
        method: 'get',
        reload: false
    })
    return data;
}

export const getAttendanceMetrics = async (submitData) => {
    const { data } = await submitData({
        endpoint: ApiRoutes.attendance.attendanceMetrics,
        method: 'get',
        reload: false
    })
    return data;
}

export const getActiveLeave = async (submitData) => {
    const { data } = await submitData({
        endpoint: ApiRoutes.leave.activeLeave,
        method: 'get',
        reload: false
    })
    return data;
}

export const getHireMetrics = async (submitData) => {
    const { data } = await submitData({
        endpoint: ApiRoutes.authentication.userMetrics,
        method: 'get',
        reload: false
    })
    return data;
}


export const getEmployeeDetails = async (submitData, id) => {
    const { data } = await submitData({
        endpoint: ApiRoutes.employees.details(id),
        method: 'get',
        reload: false
    })
    return data;
}

export const getProfile = async (submitData) => {
    const { data } = await submitData({
        endpoint: ApiRoutes.authentication.profile,
        method: 'get',
        reload: false
    })
    return data;
}

export const getEmployeeDepartment = async (submitData, id, page, size = 10, searchTerm) => {
    const { data } = await submitData({
        endpoint: ApiRoutes.authentication.department(id, page, size, searchTerm),
        method: 'get',
        reload: false
    })
    return data;
}

export const getEmployeeLeavePlans = async (submitData, employee) => {
    const { data } = await submitData({
        endpoint: ApiRoutes.leave.getPlans(employee),
        method: 'get',
        reload: false
    })
    return data;
}


export const getEmployeeLeavePlansWithLeave = async (submitData, employee) => {

    const { data } = await submitData({
        endpoint: ApiRoutes.leave.getPlansWithLeave(employee),
        method: 'get',
        reload: false
    })
    return data;
}


export const getAdminProfile = (userId, submitData) =>
    submitData({
        endpoint: ApiRoutes.admin.profile(userId),
        method: 'get'
    })

export const getPermissionGroups = (submitData) =>
    submitData({
        endpoint: ApiRoutes.permissions.allPermissions,
        method: 'get'
    })

export const getCycles = async (submitData, year = '') => {
    const response = await submitData({
        endpoint: `${ApiRoutes.performanceManager.cycle.get}?year=${year}`,
        method: 'get',
    })
    if (response?.success) {
        return response?.data
    }
    return null
}


export const getObjectives = async (submitData, employee, cycleId) => {
    const response = await submitData({
        endpoint: ApiRoutes.performanceManager.objectives.getObjectives(employee, cycleId),
        method: 'get',
    })
    if (response?.success) {
        return response?.data
    }
    return null
}

export const getQuarter = async (submitData, cycleId) =>
    await submitData({
        endpoint: ApiRoutes.performance.getQuarter(cycleId),
        method: 'get',
    })

export const getRemarks = async (submitData) =>
    await submitData({
        endpoint: ApiRoutes.performance.remarks.get,
        method: 'get',
    })



export const getUserPermissions = (userId, submitData) =>
    submitData({
        endpoint: ApiRoutes.permissions.user(userId),
        method: 'get'
    })

export const updateUserPermissions = (userId, permissionIds = [], submitData) =>
    submitData({
        endpoint: ApiRoutes.permissions.user(userId),
        method: 'post',
        data: { permissionIds }
    })


