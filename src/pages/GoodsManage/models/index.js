import { message } from 'antd';
import * as goodsService from '../services';

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
  namespace: 'goods',
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
      const { data } = yield call(goodsService.query);
      yield put({
        type: 'updateState',
        payload: {
          list: getList(data),
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      const data = yield call(goodsService.create, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('创建成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put }) {
      const data = yield call(goodsService.editor, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('修改成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *deleteGoods({ payload: values }, { call, put }) {
      const data = yield call(goodsService.deleteGoods, values);
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
