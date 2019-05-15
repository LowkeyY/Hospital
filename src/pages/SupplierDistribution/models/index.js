import { message } from 'antd';
import * as Service from '../services/index';

const getList = arr => {
  const result = [];
  if (!arr) {
    return undefined;
  }
  arr.map((item, i) => {
    result.push({
      ...item,
      key: i + 1,
    });
  });
  return result;
};

export default {
  namespace: 'supplierDistribution',
  state: {
    list: [],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    addRow(state, { payload }) {
      const index = state.list.findIndex(item => item.goodsId === payload.goodsId);
      state.list.splice(index + 1, 0, payload);
      return {
        ...state,
        list: state.list,
      };
    },
    updateRow(state, { payload }) {
      const index = state.list.findIndex(item => item.key === payload.key);
      if (index > -1) {
        const item = state.list[index];
        state.list.splice(index, 1, { ...item, ...payload });
        return {
          ...state,
          list: state.list,
        };
      } else {
        return {
          ...state,
          list: state.list.concat(payload),
        };
      }
    },
    deleteRow(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item.key !== payload),
      };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryList, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            list: getList(data),
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *addDistribution({ payload: values }, { call, put }) {
      const { data, success, msg } = yield call(Service.addDistribution, values);
      if (success) {
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/backstage/Supplier-distribution') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
