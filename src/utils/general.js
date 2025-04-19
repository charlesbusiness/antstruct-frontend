export const formatRoute = (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1/$2').toLowerCase();
};
