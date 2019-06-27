import { message } from 'antd';
import * as Service from '../services/index';

const getList = arr => {
  const result = [];
  if (!arr) {
    return undefined;
  }
  if (Array.isArray(arr)) {
    arr.map((item, i) => {
      result.push({
        ...item,
        key: i + 1,
      });
    });
  } else {
    result.push(arr);
  }
  return result;
};

export default {
  namespace: 'exWarehousing',
  state: {
    list: [],
    detailsList: [],
    totalCount: '',
    nowPage: '1',
    pageSize: '10',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/backstage/hospital-ex-warehouse/record') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
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
    *add({ payload: values }, { call }) {
      const { success, msg } = yield call(Service.outInventory, values);
      if (success) {
        message.success('已成功出库');
      } else {
        message.error(msg || '请稍后再试');
      }
    },
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
    *querySingleDetails({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.querySingleDetails, payload);
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
  },
};
