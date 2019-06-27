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
  namespace: 'supplierUser',
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
    *create({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.supplierUser);
      const data = yield call(Service.create, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('创建成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.supplierUser);
      const data = yield call(Service.editor, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('修改成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *deleteUser({ payload: values }, { call, put }) {
      const data = yield call(Service.deleteUser, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('删除成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *enableUser({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.supplierUser);
      const data = yield call(Service.enableUser, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('该用户已启用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *blockUser({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.supplierUser);
      const data = yield call(Service.blockUser, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('该用户已停用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/backstage/Supplier-User') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};