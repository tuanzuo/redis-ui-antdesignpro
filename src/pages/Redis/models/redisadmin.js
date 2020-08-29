import {
  queryRedisConfigList,
  addRedisConfig,
  removeRedisConfig,
  updateRedisConfig,
  initRedisContext,
  clearRedisTemplateCache,
  testRedisConnection,
  queryRedisKeyList,
  queryRedisKeyValue,
  delRedisKeys,
  setRedisKeyTTL,
  reNameRedisKey,
  updateKeyValue,
  addKeyValue,
} from '@/services/api';

import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { setAuthority, clearAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'redisadmin',

  state: {
    configList: [],
    keyList: [],
    keyValue: {},
  },

  effects: {
    *fetchConfigList({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisConfigList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *appendFetchConfigList({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisConfigList, payload);
      yield put({
        type: 'appendConfigList',
        payload: response,
      });
      if (callback) callback(response);

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *addConfig({ payload, callback }, { call, put }) {
      const response = yield call(addRedisConfig, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *removeConfig({ payload, callback }, { call, put }) {
      const response = yield call(removeRedisConfig, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *updateConfig({ payload, callback }, { call, put }) {
      const response = yield call(updateRedisConfig, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },

    *initContext({ payload, callback }, { call, put }) {
      const response = yield call(initRedisContext, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *clearCache({ payload, callback }, { call, put }) {
      const response = yield call(clearRedisTemplateCache, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *testConnection({ payload, callback }, { call, put }) {
      const response = yield call(testRedisConnection, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *fetchKeyList({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisKeyList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *fetchKeyValue({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisKeyValue, payload);
      yield put({
        type: 'saveKeyValue',
        payload: response,
      });
      if (callback) callback(response);

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *delKeys({ payload, callback }, { call, put }) {
      const response = yield call(delRedisKeys, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *setKeyTTL({ payload, callback }, { call, put }) {
      const response = yield call(setRedisKeyTTL, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *reNameKey({ payload, callback }, { call, put }) {
      const response = yield call(reNameRedisKey, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *updateKeyValue({ payload, callback }, { call, put }) {
      const response = yield call(updateKeyValue, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *addKeyValue({ payload, callback }, { call, put }) {
      const response = yield call(addKeyValue, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);

      //token验证失败了,就重新登录 v1.3.0
      if (response && response.code && response.code.startsWith('7')) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    handleAuth(state, { payload }) {
      const auth = [];
      auth.push('admin', 'user');
      setAuthority(auth);
      reloadAuthorized();
      return {
        ...state,
        ...payload,
      };
    },
    saveKeyValue(state, action) {
      state.keyValue = action.payload.keyValue;
      return {
        ...state,
        ...action.payload,
      };
    },
    appendConfigList(state, action) {
      return {
        ...state,
        configList: state.configList.concat(action.payload.configList),
      };
    },
  },
};
