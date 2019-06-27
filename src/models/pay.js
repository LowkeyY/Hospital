import { alipay, alipayResult } from '@/services/api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'pay',

  state: {
    html: '',
    currentPage: 0,
  },

  effects: {
    *alipay({ payload }, { call, put }) {
      const { data, msg = '', success } = yield call(alipay, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            html: data,
            currentPage: 1,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *alipayResult({ payload }, { call, put }) {
      const { data, msg = '', success } = yield call(alipayResult, payload);
      if (success) {
        if (data) {
          yield put(routerRedux.replace('/backstage/result/success'));
        } else {
          yield put(routerRedux.replace('/backstage/result/fail'));
        }
      } else {
        yield put(routerRedux.replace('/backstage/Supplier-Status/hospitals'));
        message.error(msg || '支付失败请稍后再试');
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
