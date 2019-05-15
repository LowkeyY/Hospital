import * as Service from '../services/index';
import { message } from 'antd';

const formatter = data => {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      // if (!item.menuName || !item.menuEntrance) {
      //   return null;
      // }
      const result = {
        title: item.deptName,
        value: item.deptId,
        key: item.deptId,
      };
      if (item.children) {
        const children = formatter(item.children);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
};
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
  namespace: 'hospitalOrganization',
  state: {
    organizationTree: [],
    selectedKey: '',
    treeItem: {},
    hospitalId: '',
    list: [],
    totalCount: '',
    nowPage: '1',
    pageSize: '10',
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updateTreeItem(state, { payload }) {
      return { ...state, treeItem: payload };
    },
    updateNowPage(state, { payload }) {
      return { ...state, nowPage: payload.nowPage };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(Service.queryTree, payload);
      yield put({
        type: 'updateState',
        payload: {
          organizationTree: formatter(data),
        },
      });
    },
    *createTree({ payload: values }, { call, put, select }) {
      const { hospitalId } = yield select(_ => _.hospitalOrganization);
      const data = yield call(Service.createTree, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { hospitalId } });
        message.success('创建成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editorTree({ payload: values }, { call, put, select }) {
      const { hospitalId } = yield select(_ => _.hospitalOrganization);
      const data = yield call(Service.editorTree, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { hospitalId } });
        message.success('修改成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },

    *queryTreeItem({ payload: values }, { call, put }) {
      const { data, success } = yield call(Service.queryTreeItem, values);
      if (success) {
        yield put({ type: 'updateTreeItem', payload: data });
      }
    },
    *queryList({ payload }, { call, put }) {
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
      const {
        nowPage,
        pageSize,
        treeItem: { deptId },
      } = yield select(_ => _.hospitalOrganization);
      const data = yield call(Service.createUser, values);
      if (data.success) {
        yield put({ type: 'queryList', payload: { nowPage, pageSize, deptId } });
        message.success('创建成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put, select }) {
      const {
        nowPage,
        pageSize,
        treeItem: { deptId },
      } = yield select(_ => _.hospitalOrganization);
      const data = yield call(Service.editorUser, values);
      if (data.success) {
        yield put({ type: 'queryList', payload: { nowPage, pageSize, deptId } });
        message.success('修改成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *enableUser({ payload: values }, { call, put, select }) {
      const {
        nowPage,
        pageSize,
        treeItem: { deptId },
      } = yield select(_ => _.hospitalOrganization);
      const data = yield call(Service.enableUser, values);
      if (data.success) {
        yield put({ type: 'queryList', payload: { nowPage, pageSize, deptId } });
        message.success('该用户已启用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *blockUser({ payload: values }, { call, put, select }) {
      const {
        nowPage,
        pageSize,
        treeItem: { deptId },
      } = yield select(_ => _.hospitalOrganization);
      const data = yield call(Service.blockUser, values);
      if (data.success) {
        yield put({ type: 'queryList', payload: { nowPage, pageSize, deptId } });
        message.success('该用户已停用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const { hospitalId } = query;
        dispatch({
          type: 'updateState',
          payload: {
            hospitalId,
          },
        });
      });
    },
  },
};
