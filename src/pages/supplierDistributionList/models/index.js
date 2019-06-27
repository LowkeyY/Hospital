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
  namespace: 'supplierDistributionList',
  state: {
    list: [],
    detailsList: [],
    totalCount: '',
    nowPage: '1',
    pageSize: '10',
    sum: '',
    baseId: '',
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
            sum: data.sum,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *fetchDetails({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryDetails, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            detailsList: getList(data),
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *editor({ payload }, { call, put, select }) {
      const { baseId } = yield select(_ => _.supplierDistributionList);
      const { success, msg } = yield call(Service.editor, payload);
      if (success) {
        yield put({ type: 'fetchDetails', payload: { baseId } });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/backstage/Supplier-distribution-list') {
        }
      });
    },
  },
};
