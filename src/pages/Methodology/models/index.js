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
  namespace: 'methodology',
  state: {
    list: [],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      const { data } = yield call(Service.query);
      yield put({
        type: 'updateState',
        payload: {
          list: getList(data),
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      const data = yield call(Service.create, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('创建成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put }) {
      const data = yield call(Service.editor, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('修改成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *deleteMethod({ payload: values }, { call, put }) {
      const data = yield call(Service.deleteMethod, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('删除成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {});
    },
  },
};
