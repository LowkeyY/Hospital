import { message } from 'antd';
import * as supplierService from '../services/supplier';

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
  namespace: 'supplier',
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
      const { data, success, msg } = yield call(supplierService.querySupplierList, payload);
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
    *querySupplierItem({ payload: values }, { call, put }) {
      const { data, success } = yield call(supplierService.querySupplierItem, values);
      if (success) {
        yield put({ type: 'updateSupplierItem', payload: data });
        yield put({
          type: 'updateMenuRole',
          payload: data.menuRoles,
        });
      }
    },
    *create({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.supplier);
      const data = yield call(supplierService.create, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('创建成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.supplier);
      const data = yield call(supplierService.editor, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('修改成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },

    *enable({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.supplier);
      const data = yield call(supplierService.enable, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
        message.success('已启用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *block({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.supplier);
      const data = yield call(supplierService.block, values);
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
        if (pathname === '/backstage/supplier-manage') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
