import { updateUserInfo, updatePwd } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'useropt',

  state: {
    status: undefined,
  },

  effects: {
    *updateUserInfo({ payload, callback }, { call, put }) {
      const response = yield call(updateUserInfo, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updatePwd({ payload, callback }, { call, put }) {
      const response = yield call(updatePwd, payload);
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
  },
};
