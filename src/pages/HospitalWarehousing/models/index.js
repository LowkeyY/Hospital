import { message } from 'antd';
import * as Service from '../services/index';

export default {
  namespace: 'warehousing',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {});
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *add({ payload: values }, { call, put }) {
      const { success, msg } = yield call(Service.addInventory, values);
      if (success) {
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
};
