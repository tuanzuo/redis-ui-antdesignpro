import { fakeChartData } from '@/services/api';

export default {
  namespace: 'chart',

  state: {
    //v1.5.0
    visitData: {},
    userVisitData: {},
    redisConfigVisitData: {},
    userData: {},
    roleData: {},
    redisConfigData: {},

    //visitData: [],
    visitData2: [],
    salesData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    salesTypeData: [],
    salesTypeDataOnline: [],
    salesTypeDataOffline: [],
    radarData: [],
    loading: false,
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(fakeChartData, payload);
      yield put({
        type: 'save',
        payload: response.datas || {},
      });
      if (callback) callback(response);
    },
    *fetchVisitData({ payload, callback }, { call, put }) {
      const response = yield call(fakeChartData, payload);
      yield put({
        type: 'save',
        payload: {
          visitData: response.datas.visitData || {},
          userVisitData: response.datas.userVisitData || {},
          redisConfigVisitData: response.datas.redisConfigVisitData || {},
          userData: response.datas.userData || {},
        },
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
    clear() {
      return {
        visitData: {},
        userVisitData: {},
        redisConfigVisitData: {},
        userData: {},
        roleData: {},
        redisConfigData: {},

        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};
