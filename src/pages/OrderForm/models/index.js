import { message } from 'antd';
import * as Service from '../services';

export default {
  namespace: 'orderForm',
  state: {
    done: false,
    hospitalList: [],
    orderList: [],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetchHospital(_, { call, put }) {
      const data = yield call(Service.queryHospital);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            hospitalList: data.data,
          },
        });
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },

    *applyHospital({ payload: values }, { call, put }) {
      const data = yield call(Service.addHospital, values);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            done: 'true',
          },
        });
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },

    *applyDepartment({ payload: values }, { call, put }) {
      const data = yield call(Service.addDepartment, values);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            done: 'true',
          },
        });
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *fetchOrder(_, { call, put }) {
      const data = yield call(Service.queryOrder);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            orderList: data.data,
          },
        });
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/backstage/Order-Form') {
        }
      });
    },
  },
};
