export function getUserInfo() {
  const proUser = localStorage.getItem('antd-pro-user');
  let user;
  try {
    user = JSON.parse(proUser);
  } catch (e) {
    user = proUser;
  }
  if (typeof user === 'string') {
    return user;
  }
  return user;
}

export function setUserInfo(user) {
  const proUser = typeof user === 'string' ? user : JSON.stringify(user);
  return localStorage.setItem('antd-pro-user', proUser);
}

export function clearUserInfo() {
  localStorage.removeItem('antd-pro-user');
}
