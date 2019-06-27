import { message } from 'antd';
import * as salesmanService from '../services/salesman';

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
  namespace: 'salesman',
  state: {
    list: [],
    totalCount: '',
    customerList: [],
    supplierList: [],
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
      const { data, success, msg } = yield call(salesmanService.querySalesmanList, payload);
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
      const { nowPage, pageSize } = yield select(_ => _.salesman);
      const data = yield call(salesmanService.create, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('创建成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.salesman);
      const data = yield call(salesmanService.editor, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('修改成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *deleteSalesman({ payload: values }, { call, put }) {
      const data = yield call(salesmanService.deleteSalesman, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('删除成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *enableUser({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.salesman);
      const data = yield call(salesmanService.enableUser, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('该用户已启用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *blockUser({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.salesman);
      const data = yield call(salesmanService.blockUser, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('该用户已停用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *fetchCustomer({ payload }, { call, put }) {
      const { data, success, msg } = yield call(salesmanService.queryCustomer, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            customerList: getList(data),
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *fetchSupplier({ payload }, { call, put }) {
      const { data, success, msg } = yield call(salesmanService.supplier, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            supplierList: getList(data),
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/backstage/info-manage/salesman') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
