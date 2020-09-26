import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

//v1.4.0 废弃，请使用'/services/api.js'中的queryCurrentUser
export async function queryCurrent() {
  return request('/api/currentUser');
}
