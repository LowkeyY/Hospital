import { message } from 'antd';
import { routerRedux } from 'dva/router';
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
  namespace: 'hospitalOrder',
  state: {
    goodsList: [],
    inventoryList: [],
    shortageList: [],
    earlyWarningList: [],
    overdueList: [],
    suppilerId: '',
    shopList: JSON.parse(localStorage.getItem(`shop${localStorage.getItem('userId')}`)) || [],
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
    appendGoods(state, action) {
      return {
        ...state,
        shopList: state.shopList.concat(action.payload),
      };
    },
    deleteItem(state, action) {
      return {
        ...state,
        shopList: state.shopList.filter(item => item.goodsId !== action.payload),
      };
    },
  },
  effects: {
    *fetchGoods({ payload }, { call, put, select }) {
      const { suppilerId } = yield select(_ => _.hospitalOrder);
      const { data, success, msg } = yield call(Service.queryGoodsList, { ...payload, suppilerId });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            goodsList: getList(data.data),
            totalCount: data.totalCount,
            nowPage: data.nowPage,
            pageSize: data.pageSize,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *updateGoods({ payload }, { put }) {
      const { record } = payload;
      yield put({
        type: 'appendGoods',
        payload: {
          ...record,
        },
      });
    },
    *deleteGoods({ payload }, { put }) {
      const { goodsId } = payload;
      yield put({
        type: 'deleteItem',
        payload: goodsId,
      });
    },
    *addOrder({ payload }, { call, put }) {
      const { success, msg } = yield call(Service.addOrder, payload);
      if (success) {
        message.success('成功下发订单');
        localStorage.removeItem(`shop${localStorage.getItem('userId')}`);
        yield put(routerRedux.goBack());
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *fetchInventory({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryInventory, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            inventoryList: getList(data.data),
            totalCount: data.totalCount,
            nowPage: data.nowPage,
            pageSize: data.pageSize,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *fetchShortage({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryShortage, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            shortageList: getList(data.data),
            totalCount: data.totalCount,
            nowPage: data.nowPage,
            pageSize: data.pageSize,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *fetchEarlyWarning({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryEarlyWarning, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            earlyWarningList: getList(data.data),
            totalCount: data.totalCount,
            nowPage: data.nowPage,
            pageSize: data.pageSize,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *fetchOverdue({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryOverdue, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            overdueList: getList(data.data),
            totalCount: data.totalCount,
            nowPage: data.nowPage,
            pageSize: data.pageSize,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/backstage/hospital-order/inventory') {
          dispatch({ type: 'fetchInventory', payload: query });
        }
        if (pathname === '/backstage/hospital-order/shortage') {
          dispatch({ type: 'fetchShortage', payload: query });
        }
        if (pathname === '/backstage/hospital-order/early-warning') {
          dispatch({ type: 'fetchEarlyWarning', payload: query });
        }
        if (pathname === '/backstage/hospital-order/overdue') {
          dispatch({ type: 'fetchOverdue', payload: query });
        }
      });
    },
  },
};
