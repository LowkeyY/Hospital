import { message } from 'antd';
import * as Service from '../services/index';

export default {
  namespace: 'systemConfig',
  state: {
    data: {},
    isEditor: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/backstage/systemConfig') {
        }
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      const { data, success, msg } = yield call(Service.query);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            data,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put }) {
      const data = yield call(Service.editor, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('修改成功');
        yield put({
          type: 'updateState',
          payload: {
            isEditor: true,
          },
        });
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
  },
};
