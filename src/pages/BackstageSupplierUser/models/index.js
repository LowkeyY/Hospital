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
  namespace: 'supplierUserManage',
  state: {
    list: [],
    supplierId: '',
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
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
    *create({ payload: values }, { call, put, select }) {
      const { suppilerId } = yield select(_ => _.supplierUserManage);
      const data = yield call(Service.create, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { suppilerId } });
        message.success('创建成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put, select }) {
      const { suppilerId } = yield select(_ => _.supplierUserManage);
      const data = yield call(Service.editor, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { suppilerId } });
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
      const { suppilerId } = yield select(_ => _.supplierUserManage);
      const data = yield call(Service.enableUser, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { suppilerId } });
        message.success('该用户已启用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *blockUser({ payload: values }, { call, put, select }) {
      const { suppilerId } = yield select(_ => _.supplierUserManage);
      const data = yield call(Service.blockUser, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { suppilerId } });
        message.success('该用户已停用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/backstage/supplierManage-user') {
          const { suppilerId } = query;
          dispatch({ type: 'updateState', payload: { suppilerId } });
          dispatch({ type: 'fetch', payload: { suppilerId } });
        }
      });
    },
  },
};
