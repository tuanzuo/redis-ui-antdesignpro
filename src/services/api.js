import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`http://127.0.0.1/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

//--------------------
const apiUrl = 'http://127.0.0.1';
// const apiUrl = window.location.protocol + "//" + window.location.host;
// const apiUrl="";
// console.log(window.location.protocol+"//"+window.location.host);

export async function queryRedisConfigList(params) {
  return request(`${apiUrl}/redis/config/list?${stringify(params)}`);
}

export async function addRedisConfig(params) {
  return request(`${apiUrl}/redis/config/add`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeRedisConfig(id) {
  return request(`${apiUrl}/redis/config/del/${id}`);
}

export async function updateRedisConfig(params) {
  return request(`${apiUrl}/redis/config/update`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function initRedisContext(id) {
  return request(`${apiUrl}/redis/admin/context/init/${id}`);
}

export async function clearRedisTemplateCache(id) {
  return request(`${apiUrl}/redis/admin/context/cache/clear/${id}`);
}

export async function testRedisConnection(params) {
  return request(`${apiUrl}/redis/admin/context/test/connection`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function queryRedisKeyList(params) {
  return request(`${apiUrl}/redis/admin/key/list?${stringify(params)}`);
}

export async function queryRedisKeyValue(params) {
  return request(`${apiUrl}/redis/admin/key/value`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function delRedisKeys(params) {
  return request(`${apiUrl}/redis/admin/key/del`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function setRedisKeyTTL(params) {
  return request(`${apiUrl}/redis/admin/key/setTtl`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function reNameRedisKey(params) {
  return request(`${apiUrl}/redis/admin/key/rename`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateKeyValue(params) {
  return request(`${apiUrl}/redis/admin/key/updateValue`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function addKeyValue(params) {
  return request(`${apiUrl}/redis/admin/key/addKey`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
