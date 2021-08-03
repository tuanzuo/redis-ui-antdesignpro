import { queryConfigList, addConfig, updateConfig, removeConfig } from '@/services/api';

export default {
  namespace: 'configmanager',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryConfigList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addConfig, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateConfig, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeConfig, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    //v1.7.0 保存列表数据
    saveList(state, action) {
      return {
        ...state,
        //v1.7.0 得到返回值中的datas赋值个data
        data: action.payload.datas || {},
      };
    },
    //v1.7.0
    onlySave(state, action) {
      return {
        ...state,
        //v1.7.0 去掉对data数据的更新，防止修改，添加等操作失败时列表更新为空
        //data: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
