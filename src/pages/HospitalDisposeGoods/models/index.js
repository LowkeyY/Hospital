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
  namespace: 'dispose',
  state: {
    list: [],
    infos: {},
    suppilerId: '',
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *queryDisposeList({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryDisposeList, payload);
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

    *queryInfos({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryInfos, payload);
      if (success) {
        if (data) {
          yield put({
            type: 'updateState',
            payload: {
              infos: data,
            },
          });
        }
      } else {
        message.error(msg || '请稍后再试');
      }
    },

    *addGoodsConfig({ payload }, { call, put }) {
      const { deptId, suppilerId = '' } = payload;
      const { success, msg } = yield call(Service.addGoodsConfig, payload);
      if (success) {
        message.success('配置成功');
        yield put({ type: 'queryDisposeList', payload: { deptId, suppilerId } });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *updateCongif({ payload }, { call, put }) {
      const { deptId, suppilerId = '' } = payload;
      const { success, msg } = yield call(Service.updateCongif, payload);
      if (success) {
        message.success('配置成功');
        yield put({ type: 'queryDisposeList', payload: { deptId, suppilerId } });
      } else {
        message.error(msg || '请稍后再试');
      }
    },

    *quickCongif({ payload }, { call, put }) {
      const { deptId, suppilerId = '' } = payload;
      const { success, msg } = yield call(Service.quickCongif, payload);
      if (success) {
        message.success('配置成功');
        yield put({ type: 'queryDisposeList', payload: { deptId, suppilerId } });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/backstage/hospital-dispose' && history.action === 'PUSH') {
          dispatch({
            type: 'updateState',
            payload: {
              list: [],
              infos: {},
              supplierId: '',
            },
          });
        }
      });
    },
  },
};
