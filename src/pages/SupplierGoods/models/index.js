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
  namespace: 'supplierGoods',
  state: {
    list: [],
    goodsList: [],
    totalCount: '',
    nowPage: '1',
    pageSize: '10',
    goodsNowPage: '1',
    goodsPageSize: '10',
    deptId: '',
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updatePageSize(state, { payload }) {
      return { ...state, pageSize: payload.pageSize };
    },
    updateGoodsPageSize(state, { payload }) {
      return { ...state, goodsPageSize: payload.goodsPageSize };
    },
    updateNowPage(state, { payload }) {
      return { ...state, nowPage: payload.nowPage };
    },
    updateGoodsNowPage(state, { payload }) {
      return { ...state, goodsNowPage: payload.goodsNowPage };
    },
    updateRow(state, { payload }) {
      const index = state.goodsList.findIndex(item => item.goodsId === payload.goodsId);
      if (index > -1) {
        const item = state.goodsList[index];
        state.goodsList.splice(index, 1, { ...item, ...payload });
        return {
          ...state,
          goodsList: state.goodsList,
        };
      }
      return {
        ...state,
        list: state.list.concat(payload),
      };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
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
    *fetchGoods({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryGoodsList, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            goodsList: getList(data.data),
            totalCount: data.totalCount,
            goodsNowPage: data.nowPage,
            goodsPageSize: data.pageSize,
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *addGoods({ payload }, { call, put, select }) {
      const data = yield call(Service.addGoods, payload);
      if (data.success) {
        const { goodsNowPage, goodsPageSize, deptId } = yield select(_ => _.supplierGoods);
        yield put({
          type: 'fetchGoods',
          payload: { nowPage: goodsNowPage, pageSize: goodsPageSize, deptId },
        });
        message.success('添加成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize, deptId } = yield select(_ => _.supplierGoods);
      const data = yield call(Service.editor, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize, deptId } });
        message.success('修改成功');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },

    *enable({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize, deptId } = yield select(_ => _.supplierGoods);
      const data = yield call(Service.enable, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize, deptId } });
        message.success('该货品已启用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *block({ payload: values }, { call, put, select }) {
      const { nowPage, pageSize, deptId } = yield select(_ => _.supplierGoods);
      const data = yield call(Service.block, values);
      if (data.success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize, deptId } });
        message.success('该货品已停用');
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/backstage/Supplier-goods') {
          const { deptId = '' } = query;
          dispatch({
            type: 'updateState',
            payload: {
              deptId,
              nowPage: '1',
              goodsNowPage: '1',
            },
          });
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
