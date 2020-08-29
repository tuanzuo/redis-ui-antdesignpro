export function getToken() {
  return localStorage.getItem('antd-pro-token');
}

export function setToken(token) {
  return localStorage.setItem('antd-pro-token', token);
}

export function clearToken() {
  localStorage.removeItem('antd-pro-token');
}
