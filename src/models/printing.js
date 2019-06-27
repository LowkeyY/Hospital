import * as Service from '@/services/printing';
import { message } from 'antd';

export default {
  namespace: 'printing',

  state: {
    supplierDetails: [],
    supplierBase: [],
  },

  effects: {
    *querySupplierDetails({ payload }, { call, put }) {
      const { data, msg = '', success } = yield call(Service.querySupplierDetails, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            supplierDetails: data,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *querySupplierBase({ payload }, { call, put }) {
      const { data, msg = '', success } = yield call(Service.querySupplierBase, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            supplierBase: data,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
