import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, fakeAccountLogout, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { getToken, setToken } from '@/utils/token';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (callback) callback(response);

      // Login successfully
      if (response.code === '200') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogout, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
          token: '', //v1.3.0 token
          user: {}, //v1.3.0 用户信息
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      payload = payload || {};
      payload.datas = payload.datas || {};
      //v1.3.0 设置权限
      const authRole = payload.currentAuthority || payload.datas.roles;
      setAuthority(authRole);
      //v1.3.0 设置token
      const token = payload.token || payload.datas.token;
      setToken(token);
      return {
        ...state,
        ...payload,
      };
    },
  },
};
