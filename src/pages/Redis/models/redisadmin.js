import {
  queryRedisConfigList,
  addRedisConfig,
  removeRedisConfig,
  updateRedisConfig,
  uploadFile,
  downloadFile,
  initRedisContext,
  clearRedisTemplateCache,
  testRedisConnection,
  queryRedisServerInfo,
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
        type: 'saveConfigList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *appendFetchConfigList({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisConfigList, payload);
      yield put({
        type: 'appendConfigList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *addConfig({ payload, callback }, { call, put }) {
      const response = yield call(addRedisConfig, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *removeConfig({ payload, callback }, { call, put }) {
      const response = yield call(removeRedisConfig, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updateConfig({ payload, callback }, { call, put }) {
      const response = yield call(updateRedisConfig, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *uploadFile({ payload, callback }, { call, put }) {
      const response = yield call(uploadFile, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *downloadFile({ payload, callback }, { call, put }) {
      const response = yield call(downloadFile, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    //-------------------------------------------

    *initContext({ payload, callback }, { call, put }) {
      const response = yield call(initRedisContext, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *clearCache({ payload, callback }, { call, put }) {
      const response = yield call(clearRedisTemplateCache, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *testConnection({ payload, callback }, { call, put }) {
      const response = yield call(testRedisConnection, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchRedisServerInfo({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisServerInfo, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchKeyList({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisKeyList, payload);
      yield put({
        type: 'saveKeyList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchKeyValue({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisKeyValue, payload);
      yield put({
        type: 'saveKeyValue',
        payload: response,
      });
      if (callback) callback(response);
    },
    *delKeys({ payload, callback }, { call, put }) {
      const response = yield call(delRedisKeys, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *setKeyTTL({ payload, callback }, { call, put }) {
      const response = yield call(setRedisKeyTTL, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *reNameKey({ payload, callback }, { call, put }) {
      const response = yield call(reNameRedisKey, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updateKeyValue({ payload, callback }, { call, put }) {
      const response = yield call(updateKeyValue, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *addKeyValue({ payload, callback }, { call, put }) {
      const response = yield call(addKeyValue, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
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
    saveConfigList(state, action) {
      return {
        ...state,
        configList: action.payload.datas.configList || [],
      };
    },
    appendConfigList(state, action) {
      return {
        ...state,
        configList: state.configList.concat(action.payload.datas.configList || []),
      };
    },
    saveKeyList(state, action) {
      return {
        ...state,
        keyList: action.payload.datas.keyList || [],
      };
    },
    saveKeyValue(state, action) {
      return {
        ...state,
        keyValue: action.payload.datas.keyValue || {},
      };
    },
  },
};
