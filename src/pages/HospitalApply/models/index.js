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
  namespace: 'hospitalApply',
  state: {
    list: [],
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

    *pass({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.hospitalApply);
      const data = yield call(Service.pass, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('已启用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },

    *fail({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.hospitalApply);
      const data = yield call(Service.fail, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('已启用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },

    *enable({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.hospitalApply);
      const data = yield call(Service.enable, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('已启用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *block({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.hospitalApply);
      const data = yield call(Service.block, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('已停用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/backstage/hospital-apply') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
