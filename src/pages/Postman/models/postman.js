import {
  queryPostmanConfigList,
  addPostmanConfig,
  updatePostmanConfig,
  delPostmanConfig,
  sendRequest,
} from '@/services/api';

export default {
  namespace: 'postman',

  state: {
    data: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryPostmanConfigList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPostmanConfig, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updatePostmanConfig, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(delPostmanConfig, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
    *send({ payload, callback }, { call, put }) {
      const response = yield call(sendRequest, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    //v1.7.1 保存列表数据
    saveList(state, action) {
      return {
        ...state,
        //v1.7.1 得到返回值中的datas赋值个data
        data: action.payload.datas || {},
      };
    },
    //v1.7.1
    onlySave(state, action) {
      return {
        ...state,
        //v1.7.1 去掉对data数据的更新，防止修改，添加等操作失败时列表更新为空
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
