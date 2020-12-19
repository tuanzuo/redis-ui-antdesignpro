import { fakeRegister } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
    //v1.3.0
    registerCode: undefined,
  },

  effects: {
    //注册
    *submit({ payload, callback }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      //v1.3.0 注释代码
      /*setAuthority('user');
      reloadAuthorized();*/
      return {
        ...state,
        status: payload.status,
        //v1.3.0
        registerCode: payload.code,
      };
    },
  },
};
