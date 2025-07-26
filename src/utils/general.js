
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
  console.log(cleared)
  return cleared
}







