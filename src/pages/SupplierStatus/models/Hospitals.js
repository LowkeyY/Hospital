import { message } from 'antd';
import * as Service from '../services';

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
  namespace: 'hospitals',
  state: {
    list: [],
    nowPage: '1',
    pageSize: '10',
    currentPage: 0,
    payNumber: 0,
    payList: [],
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
      const { data, success, msg } = yield call(Service.queryHospital, payload);
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
    *queryPayMoney(_, { call, put }) {
      const { data, success, msg } = yield call(Service.queryPayMoney);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            payNumber: data.annualFee,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *queryPayRecord({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryPayRecord, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            payList: data,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *payChick({ payload }, { call }) {
      const { data, success, msg } = yield call(Service.payChick, payload);
      if (success) {
        if (data) {
          message.success('验证成功');
        } else {
          message.error('验证失败');
        }
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
};
