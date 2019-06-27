import { message } from 'antd';
import router from 'umi/router';
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

const defaultInfo = {
  distributor: '',
  phoneNumber: '',
  arrivalTime: null,
  hospitalId: '',
  deptId: '',
};

export default {
  namespace: 'addNewDistribution',
  state: {
    goodsList: [],
    distributionList: [],
    totalCount: '',
    info: defaultInfo,
    hospital: [],
    department: [],
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
        distributionList: state.distributionList.concat(action.payload),
      };
    },
    deleteItem(state, action) {
      return {
        ...state,
        distributionList: state.distributionList.filter(item => item.goodsId !== action.payload),
      };
    },
    updateHospital(state, { payload }) {
      return { ...state, hospital: payload.hospital };
    },
    updateDepartment(state, { payload }) {
      return { ...state, department: payload.department };
    },
    updateRow(state, { payload }) {
      const index = state.distributionList.findIndex(item => item.key === payload.key);
      if (index > -1) {
        const item = state.distributionList[index];
        state.distributionList.splice(index, 1, { ...item, ...payload });
        return {
          ...state,
          distributionList: state.distributionList,
        };
      } else {
        return {
          ...state,
          distributionList: state.distributionList.concat(payload),
        };
      }
    },
    addRow(state, { payload }) {
      const index = state.distributionList.findIndex(item => item.goodsId === payload.goodsId);
      state.distributionList.splice(index + 1, 0, payload);
      return {
        ...state,
        distributionList: state.distributionList,
      };
    },
    deleteRow(state, { payload }) {
      return {
        ...state,
        distributionList: state.distributionList.filter(item => item.key !== payload),
      };
    },
  },
  effects: {
    *fetchGoods({ payload }, { call, put, select }) {
      const {
        info: { deptId },
      } = yield select(_ => _.addNewDistribution);
      const { data, success, msg } = yield call(Service.queryGoodsList, { ...payload, deptId });
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
    *updateDistribution({ payload }, { put }) {
      const { record } = payload;
      yield put({
        type: 'appendGoods',
        payload: {
          ...record,
        },
      });
    },
    *getHospital(_, { call, put }) {
      const response = yield call(Service.queryHospital);
      if (response.success) {
        yield put({
          type: 'updateHospital',
          payload: {
            hospital: response.data,
          },
        });
      }
    },
    *getDepartment({ payload }, { call, put }) {
      const response = yield call(Service.queryDepartment, payload);
      if (response.success) {
        yield put({
          type: 'updateDepartment',
          payload: {
            department: response.data,
          },
        });
      }
    },
    *addDistribution({ payload: values }, { call, put }) {
      const { success, msg } = yield call(Service.addDistribution, values);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            info: defaultInfo,
          },
        });
        router.push('/backstage/Add-supplier/result');
      } else {
        message.error(msg || '请稍后再试');
      }
    },

    *deleteGoods({ payload }, { put }) {
      const { key } = payload;
      yield put({
        type: 'deleteRow',
        payload: key,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname.search('backstage/Add-supplier') === -1) {
          dispatch({
            type: 'updateState',
            payload: {
              info: defaultInfo,
            },
          });
        }
      });
    },
  },
};
