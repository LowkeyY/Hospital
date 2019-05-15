/**
 * Created by Lowkey on 2019/4/2 23:40
 * version:1.0
 */
import { routerRedux } from 'dva/router';
import { notification, message } from 'antd';
import { login, logout } from '@/services/api';
import { getPageQuery } from '@/utils/utils';

export default {
  namespace: 'login',

  state: {
    currentUser: {},
    msg: '',
    status: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response.success) {
        //记住退出前的路由
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        message.error(response.msg);
        yield put({
          type: 'updateState',
          payload: {
            msg: response.msg,
            status: response.status,
          },
        });
      }
    },

    *logout(_, { put, call }) {
      const response = yield call(logout);
      if (response.success) {
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        yield put(
          routerRedux.push({
            pathname: '/user/login',
          })
        );
      } else {
        notification.error({
          message: `请求错误 ${response.status}}`,
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      localStorage.setItem('userName', action.payload.realName);
      localStorage.setItem('userId', action.payload.userId);
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
