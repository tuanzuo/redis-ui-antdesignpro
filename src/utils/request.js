import fetch from 'dva/fetch';
import { notification, Modal } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { isAntdPro } from './utils';
import { getToken, setToken, getReloginFlag, setReloginFlag } from '@/utils/token';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  //v1.4.0
  700: 'token验证失败。',
};

const checkStatus = response => {
  //V1.4.0 【token验证失败时，后端会往header中写入一条code='700'的数据；所以在这里如果判断到code='700'，
  // 那么久表示token验证不通过，强制退出系统】
  if (response.headers.get('code') == '700') {
    //重新登录弹窗flag
    let reloginFlag = getReloginFlag();
    if (reloginFlag && reloginFlag == 'false') {
      return response;
    } else {
      Modal.confirm({
        title: '提示信息',
        content: 'Token过期，需要重新登录吗？',
        okText: '重新登录',
        cancelText: '取消',
        onCancel: () => handleCancle(response),
        onOk: () => handleOk(response),
      });
    }
  } else {
    return checkStatusNew(response);
  }
};

//v1.4.0
const handleCancle = response => {
  setReloginFlag('false');
};
const handleOk = response => {
  //v1.4.0 强制退出系统
  window.g_app._store.dispatch({
    type: 'login/logout',
  });

  //v1.4.0 这里token验证不通过，直接返回空
  return;
  //return response;
};

const checkStatusNew = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    expirys: isAntdPro(),
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };

  //得到token设置到header中-v1.3.0
  const token = getToken();
  if (token && token != 'undefined' && token != '') {
    newOptions.headers = {
      Authorization: token,
      ...newOptions.headers,
    };
  } else {
    let authFlag = true;
    //不登录就可以访问的url
    const noAuthPreUrlArray = ['/auth/user/register'];
    noAuthPreUrlArray.forEach(preUrl => {
      if (authFlag && url.indexOf(preUrl) > -1) {
        authFlag = false;
      }
    });

    if (authFlag) {
      //需要登录才能访问的url，没有token跳转到登录页面-v1.3.0
      const authPreUrlArray = ['/redis/', '/auth/'];
      authPreUrlArray.forEach(preUrl => {
        if (url.indexOf(preUrl) > -1) {
          router.push('/user/login');
          return;
        }
      });
    }
  }

  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}
