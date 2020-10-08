import {
  queryUserList,
  removeRule,
  addRule,
  updateStatus,
  resetPwd,
  grantRole,
} from '@/services/api';

export default {
  namespace: 'usermanager',

  state: {
    data: {
      list: [],
      pagination: {},
      roles: [],
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updateStatus({ payload, callback }, { call, put }) {
      const response = yield call(updateStatus, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
    *resetPwd({ payload, callback }, { call, put }) {
      const response = yield call(resetPwd, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
    *grantRole({ payload, callback }, { call, put }) {
      const response = yield call(grantRole, payload);
      yield put({
        type: 'onlySave',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    //v1.4.0 保存列表数据
    saveList(state, action) {
      return {
        ...state,
        //v1.4.0 得到返回值中的datas赋值个data
        data: action.payload.datas || {},
      };
    },
    //v1.4.0
    onlySave(state, action) {
      return {
        ...state,
        //v1.4.0 去掉对data数据的更新，防止修改，添加等操作失败时列表更新为空
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
