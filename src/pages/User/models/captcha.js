import { fakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'captcha',

  state: {
    //v1.6.0 验证码对象
    captchaInfo: {},
  },

  effects: {
    //v1.6.0 拉取验证码
    *fakeCaptcha({ payload, callback }, { call, put }) {
      const response = yield call(fakeCaptcha, payload);
      yield put({
        type: 'captchaHandle',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    captchaHandle(state, { payload }) {
      return {
        ...state,
        //v1.6.0 设置验证码
        captchaInfo: payload.datas || {},
      };
    },
  },
};
