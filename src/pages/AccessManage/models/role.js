import { message } from 'antd';
import * as roleService from '../services/menu';

const getRoleList = arr => {
  const result = [];
  if (!arr) {
    return undefined;
  }
  arr.map(item => {
    result.push({
      ...item,
      key: item.roleId,
    });
  });
  return result;
};

export default {
  namespace: 'roleManage',
  state: {
    roleList: [],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      const { data } = yield call(roleService.queryRoleList);
      yield put({
        type: 'updateState',
        payload: {
          roleList: getRoleList(data),
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      const data = yield call(roleService.createRole, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('创建成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put }) {
      const data = yield call(roleService.editorRole, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('修改成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *deleteRole({ payload: values }, { call, put }) {
      const data = yield call(roleService.deleteRole, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('删除成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *queryMenuItem({ payload: values }, { call, put }) {
      const { data, success } = yield call(menuService.queryMenuItem, values);
      if (success) {
        yield put({ type: 'updateMenuItem', payload: data });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {});
    },
  },
};
