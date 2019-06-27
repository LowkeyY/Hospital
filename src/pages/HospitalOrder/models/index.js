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
    quickLhopList: [],
    totalCount: '',
    nowPage: '1',
    pageSize: '10',
    infos: {},
    hasButton: true,
    deptId: '',
    count: '',
    earlyCount: '',
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
    deleteQuickItem(state, action) {
      return {
        ...state,
        quickLhopList: state.quickLhopList.filter(item => item.goodsId !== action.payload),
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
    *deleteQuickGoods({ payload }, { put }) {
      const { goodsId } = payload;
      yield put({
        type: 'deleteQuickItem',
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
            shortageList: getList(data),
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

    *queryQuickList({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryQuickList, payload);
      if (success) {
        if (data) {
          yield put({
            type: 'updateState',
            payload: {
              quickLhopList: getList(data),
            },
          });
        }
      } else {
        message.error(msg || '请稍后再试');
      }
    },

    *addGoodsConfig({ payload }, { call }) {
      const { success, msg } = yield call(Service.addGoodsConfig, payload);
      if (success) {
        // yield put({ type: 'fetch' });
        message.success('配置成功');
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *updateCongif({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.updateCongif, payload);
      if (success) {
        // yield put({ type: 'fetch' });
        message.success('配置成功');
      } else {
        message.error(msg || '请稍后再试');
      }
    },

    *report({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize } = yield select(_ => _.hospitalOrder);
      const data = yield call(Service.report, values);
      if (data.success) {
        yield put({ type: 'fetchOverdue', payload: { nowPage, pageSize } });
        message.success('已报损');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },

    *fetchCount({ payload }, { call, put, select }) {
      const { data, success, msg } = yield call(Service.queryCount, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            count: data,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },

    *fetchEarlyCount({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryEarlyWarning, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            earlyCount: data.totalCount,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/backstage/hospital-ordering') {
          dispatch({
            type: 'updateState',
            payload: {
              goodsList: [],
              suppilerId: '',
              shopList:
                JSON.parse(localStorage.getItem(`shop${localStorage.getItem('userId')}`)) || [],
            },
          });
        }
        if (pathname.search('hospital-order') !== -1) {
          dispatch({ type: 'updateState', payload: { hasButton: false } });
        }
        if (pathname.search('hospital-dispose-manage') !== -1) {
          dispatch({ type: 'updateState', payload: { hasButton: true } });
        }
      });
    },
  },
};
