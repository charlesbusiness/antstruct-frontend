import { APP_ROLE } from "./consts";

export const formatRoute = (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1/$2').toLowerCase();
}
export const formatDate = (rawDate) => {
  if (!rawDate) return
  const formatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', year: 'numeric', month: 'long',
    day: 'numeric', hour: 'numeric', minute: '2-digit',
    hour12: true
  }).format(new Date(rawDate.replace(' ', 'T')))
  return formatted
}


export const formatDateOnly = (rawDate) => {
  if (!rawDate) return
  const formatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', year: 'numeric', month: 'long',
    day: 'numeric',
    hour12: true
  }).format(new Date(rawDate.replace(' ', 'T')))
  return formatted
}

export const TaskStatus = ['in-progress', 'reviewd', 'completed', 'approved', 'testing', 'pending',];

export const REQUISITION_TYPES = {
  MONEY: 'monetary',
  EQUIPMENT: 'equipment',
  HR: 'internal'
};

export function resetFormData(template) {
  const cleared = {}
  for (const key in template) {
    cleared[key] = ''
  }
  return cleared
}


export const getYearOptions = (startYear = 2020) => {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + 1;

  return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return { label: year.toString(), value: year.toString() };
  })
}



export const isAdmin = (profile) => {
  const key = profile?.appRole?.key;
  return key === APP_ROLE.BUSINESS_ADMIN || key === APP_ROLE.BUSINESS_SUPER_ADMIN;
};


export const isManager = (profile) => {
  return profile?.isManager == true;
}

export const isGeneralUser = (profile) => {
  return profile?.appRole?.key == APP_ROLE.BUSINESS_GENERAL_USER;
}








