//----------------token--------------------------
export function getToken() {
  return localStorage.getItem('antd-pro-token');
}

export function setToken(token) {
  return localStorage.setItem('antd-pro-token', token);
}

export function clearToken() {
  localStorage.removeItem('antd-pro-token');
}

//-------------------login/logout callback-----------------------

//登录or退出回调
export function loginOutCallback() {
  clearReloginFlag();
  clearCurrentUser();
}

//--------------------是否重新登录弹窗标识--------------------------

//得到时候重新登录的标识
export function getReloginFlag() {
  return localStorage.getItem('antd-pro-relogin-flag');
}

export function setReloginFlag(flag) {
  return localStorage.setItem('antd-pro-relogin-flag', flag);
}

export function clearReloginFlag() {
  localStorage.removeItem('antd-pro-relogin-flag');
}

//--------------------当前用户信息------------------------

export function getCurrentUser() {
  let userJson = localStorage.getItem('antd-pro-user');
  let user;
  try {
    user = JSON.parse(userJson);
  } catch (e) {
    user = userJson;
  }
  return user || {};
}

export function setCurrentUser(user) {
  const userJson = typeof user === 'string' ? user : JSON.stringify(user);
  return localStorage.setItem('antd-pro-user', userJson);
}

export function clearCurrentUser() {
  localStorage.removeItem('antd-pro-user');
}
