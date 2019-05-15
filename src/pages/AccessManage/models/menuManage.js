import * as menuService from '../services/menu';
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
        title: item.menuName,
        value: item.menuId,
        key: item.menuId,
        icon: item.menuIcon,
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
const defaultMenuItem = {
  menuName: '',
  menuRoles: '',
  sort: '',
  menuIcon: '',
};
export default {
  namespace: 'menuManage',
  state: {
    menuTree: [],
    selectedKey: '',
    menuItem: defaultMenuItem,
    menuRole: [],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updateMenuItem(state, { payload }) {
      return { ...state, menuItem: payload };
    },
    updateMenuRole(state, { payload }) {
      return { ...state, menuRole: payload };
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      const { data } = yield call(menuService.queryMenuList);
      yield put({
        type: 'updateState',
        payload: {
          menuTree: formatter(data),
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      const data = yield call(menuService.create, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('创建成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put }) {
      const data = yield call(menuService.editor, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('修改成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *deleteMenu({ payload: values }, { call, put }) {
      const data = yield call(menuService.deleteMenu, values);
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
        yield put({
          type: 'updateMenuRole',
          payload: data.menuRoles.split(','),
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {});
    },
  },
};
