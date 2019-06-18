import {
  queryRedisConfigList, addRedisConfig, removeRedisConfig, updateRedisConfig,
  initRedisContext, queryRedisKeyList, queryRedisKeyValue, delRedisKeys,
  setRedisKeyTTL, reNameRedisKey,
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
      if (callback) callback();
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
    *fetchKeyList({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisKeyList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchKeyValue({ payload, callback }, { call, put }) {
      const response = yield call(queryRedisKeyValue, payload);
      yield put({
        type: 'saveKeyValue',
        payload: response,
      });
      if (callback) callback();
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
  },
};
