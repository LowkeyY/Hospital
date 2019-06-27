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
  namespace: 'financeManage',
  state: {
    list: [],
    recordList: [],
    rechargeList: [],
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

    *recharge({ payload: values }, { call }) {
      const data = yield call(Service.recharge, values);
      if (data.success) {
        message.success('充值成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },

    *queryPayRecord({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryPayRecord, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            recordList: data,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },

    *fetchRecharge({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryRecharge, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            rechargeList: getList(data),
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },

    *doRecharge({ payload }, { call, put, select }) {
      const { success, msg } = yield call(Service.doRecharge, payload);
      if (success) {
        message.success('操作成功！');
        yield put({ type: 'fetchRecharge' });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {});
    },
  },
};
