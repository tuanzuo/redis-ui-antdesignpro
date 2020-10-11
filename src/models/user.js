import { queryCurrentUser } from '@/services/api';
import { getCurrentUser, setCurrentUser } from '@/utils/token';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    /**fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },*/
    *fetchCurrent(_, { call, put }) {
      //v1.4.0 查询当前登录用户信息
      const response = yield call(queryCurrentUser);
      let userInfo = null;
      //获取不到新的用户数据，就使用之前的数据
      if (response && response.code === '200') {
        userInfo = response.datas || {};
        setCurrentUser(userInfo);
      } else {
        userInfo = getCurrentUser();
      }
      yield put({
        type: 'saveCurrentUser',
        payload: userInfo,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
