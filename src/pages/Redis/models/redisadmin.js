import {
  queryRedisConfigList, addRedisConfig, removeRedisConfig, updateRedisConfig,
  initRedisContext, clearRedisTemplateCache, testRedisConnection, queryRedisKeyList,
  queryRedisKeyValue, delRedisKeys,
  setRedisKeyTTL, reNameRedisKey, updateKeyValue,
} from '@/services/api';

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
      if (callback) callback();
    },
    *removeConfig({ payload, callback }, { call, put }) {
      const response = yield call(removeRedisConfig, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *updateConfig({ payload, callback }, { call, put }) {
      const response = yield call(updateRedisConfig, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *initContext({ payload, callback }, { call, put }) {
      const response = yield call(initRedisContext, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *clearCache({ payload, callback }, { call, put }) {
      const response = yield call(clearRedisTemplateCache, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *testConnection({ payload, callback }, { call, put }) {
      const response = yield call(testRedisConnection, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchKeyList({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisKeyList, payload);
      yield put({
        type: 'save',
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
      if (callback) callback();
    },
    *setKeyTTL({ payload, callback }, { call, put }) {
      const response = yield call(setRedisKeyTTL, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *reNameKey({ payload, callback }, { call, put }) {
      const response = yield call(reNameRedisKey, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *updateKeyValue({ payload, callback }, { call, put }) {
      const response = yield call(updateKeyValue, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, { payload }) {
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
