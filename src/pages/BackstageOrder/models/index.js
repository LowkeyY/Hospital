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
  namespace: 'backstageOrder',
  state: {
    list: [],
    orderList: [],
    totalCount: '',
    nowPage: '1',
    pageSize: '10',
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updatePageSize(state, { payload }) {
      return { ...state, pageSize: payload.pageSize };
    },
    updateNowPage(state, { payload }) {
      return { ...state, nowPage: payload.nowPage };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryList, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            list: getList(data.data),
            totalCount: data.totalCount,
            nowPage: data.nowPage,
            pageSize: data.pageSize,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *fetchOrder({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryDetails, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            orderList: getList(data),
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *recall({ payload }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.backstageOrder);
      const { success, msg } = yield call(Service.recall, payload);
      if (success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('已撤回该订单');
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/backstage/order-list') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
