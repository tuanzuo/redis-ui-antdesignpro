import { stringify } from 'qs';
import request from '@/utils/request';
import { getToken } from '@/utils/token';
import router from 'umi/router';

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

/*export async function fakeChartData() {
  return request('/api/fake_chart_data');
}*/

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

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

//----------------------------------------------------------------------------------------------------
const apiUrl = 'http://127.0.0.1';
// const apiUrl = window.location.protocol + "//" + window.location.host;
// const apiUrl="";
// console.log(window.location.protocol+"//"+window.location.host);

export function getApiUrl() {
  return apiUrl;
}

//----------dashboard----------

export async function fakeChartData(params) {
  return request(`${apiUrl}/auth/dashboard/analysis`, {
    method: 'POST',
    body: params,
  });
}

//----------验证码----------

//拉取验证码
export async function fakeCaptcha() {
  return request(`${apiUrl}/captcha`);
}

//----------user----------

export async function fakeRegister(params) {
  return request(`${apiUrl}/auth/user/register`, {
    method: 'POST',
    body: params,
  });
}

export async function queryCurrentUser() {
  return request(`${apiUrl}/auth/user/current`);
}

export async function updateUserInfo(params) {
  return request(`${apiUrl}/auth/user/update`, {
    method: 'POST',
    body: params,
  });
}

export async function updatePwd(params) {
  return request(`${apiUrl}/auth/user/update/pwd`, {
    method: 'POST',
    body: params,
  });
}

//登录
export async function fakeAccountLogin(params) {
  return request(`${apiUrl}/login`, {
    method: 'POST',
    body: params,
  });
}

export async function fakeAccountLogout(params) {
  return request(`${apiUrl}/logout`, {
    method: 'POST',
    body: params,
  });
}

//----------usermanager----------

export async function queryUserList(params) {
  return request(`${apiUrl}/auth/user/list?${stringify(params)}`);
}

export async function updateStatus(params) {
  return request(`${apiUrl}/auth/user/update/status`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function resetPwd(params) {
  return request(`${apiUrl}/auth/user/reset/pwd`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function grantRole(params) {
  return request(`${apiUrl}/auth/user/grant/role`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//----------rolemanager----------

export async function queryRoleList(params) {
  return request(`${apiUrl}/auth/role/list?${stringify(params)}`);
}

export async function addRole(params) {
  return request(`${apiUrl}/auth/role/add`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRole(params) {
  return request(`${apiUrl}/auth/role/update`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRoleStatus(params) {
  return request(`${apiUrl}/auth/role/update/status`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeRole(params) {
  return request(`${apiUrl}/auth/role/del`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//----------configmanager----------

export async function queryConfigList(params) {
  return request(`${apiUrl}/config/list?${stringify(params)}`);
}

export async function addConfig(params) {
  return request(`${apiUrl}/config/add`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateConfig(params) {
  return request(`${apiUrl}/config/update`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeConfig(params) {
  return request(`${apiUrl}/config/del`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//----------redis----------

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

export async function uploadFile(params) {
  return request(`${apiUrl}/redis/config/upload`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//v1.7.0 下载
export async function downloadFile(params) {
  // return request(`${apiUrl}/redis/config/download?${stringify(params)}`);
  const downloadUrl = `${apiUrl}/redis/config/download?${stringify(params)}`;
  const token = getToken();
  if (token && token != 'undefined' && token != '') {
    fetch(downloadUrl, {
      method: 'GET',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: token,
      }),
    })
      .then(response => {
        response.blob().then(blob => {
          const aLink = document.createElement('a');
          document.body.appendChild(aLink);
          aLink.style.display = 'none';
          const objectUrl = window.URL.createObjectURL(blob);
          aLink.href = objectUrl;
          aLink.download = params.name;
          aLink.click();
          document.body.removeChild(aLink);
        });
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    router.push('/user/login');
    return;
  }
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

export async function queryRedisServerInfo(id) {
  return request(`${apiUrl}/redis/admin/server/info/${id}`);
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
