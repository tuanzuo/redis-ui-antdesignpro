import { queryRoleList, addRole, updateRole, removeRole, updateRoleStatus } from '@/services/api';

export default {
  namespace: 'rolemanager',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRoleList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updateStatus({ payload, callback }, { call, put }) {
      const response = yield call(updateRoleStatus, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRole, payload);
      yield put({
        type: 'save',
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
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
