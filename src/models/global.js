import {
  querySalesman,
  queryMethod,
  queryClassify,
  queryRole,
  queryHospital,
  queryDepartment,
  querySupplier,
  queryCount,
  querySupplierCount,
  queryHospitalDept,
  editorPwd,
  queryAllSupplier,
  queryAllHospital,
  AvailableHospital,
} from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    salesman: [],
    method: [],
    classify: [],
    role: [],
    hospital: [],
    department: [],
    supplier: [],
    orderCount: '',
    supplierCount: '',
    dept: [],
    pwdVisble: false,
    allHospitalList: [],
    allSupplierList: [],
    availableHospital: [],
  },

  effects: {
    *querySalesman(_, { call, put }) {
      const response = yield call(querySalesman);
      if (response.success) {
        yield put({
          type: 'updateSalesman',
          payload: {
            salesman: response.data,
          },
        });
      }
    },
    *queryMethod(_, { call, put }) {
      const response = yield call(queryMethod);
      if (response.success) {
        yield put({
          type: 'updateMethod',
          payload: {
            method: response.data,
          },
        });
      }
    },
    *queryRole(_, { call, put }) {
      const response = yield call(queryRole);
      if (response.success) {
        yield put({
          type: 'updateRole',
          payload: {
            role: response.data,
          },
        });
      }
    },
    *queryClassify(_, { call, put }) {
      const response = yield call(queryClassify);
      if (response.success) {
        yield put({
          type: 'updateClassify',
          payload: {
            classify: response.data,
          },
        });
      }
    },
    *getHospital(_, { call, put }) {
      const response = yield call(queryHospital);
      if (response.success) {
        yield put({
          type: 'updateHospital',
          payload: {
            hospital: response.data,
          },
        });
      }
    },
    *getDept(_, { call, put }) {
      const response = yield call(queryHospitalDept);
      if (response.success) {
        yield put({
          type: 'updateDept',
          payload: {
            dept: response.data,
          },
        });
      }
    },
    *getDepartment({ payload }, { call, put }) {
      const response = yield call(queryDepartment, payload);
      if (response.success) {
        yield put({
          type: 'updateDepartment',
          payload: {
            department: response.data,
          },
        });
      }
    },
    *getSupplier({ payload }, { call, put }) {
      const response = yield call(querySupplier, payload);
      if (response.success) {
        yield put({
          type: 'updateSupplier',
          payload: {
            supplier: response.data,
          },
        });
      }
    },
    *queryCount({ payload }, { call, put }) {
      const response = yield call(queryCount, payload);
      if (response.success) {
        yield put({
          type: 'updateCount',
          payload: {
            orderCount: response.data,
          },
        });
      }
    },
    *querySupplierCount({ payload }, { call, put }) {
      const response = yield call(querySupplierCount, payload);
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            supplierCount: response.data,
          },
        });
      }
    },
    *editorPass({ payload: values }, { call, put }) {
      const data = yield call(editorPwd, values);
      if (data.success) {
        message.success('修改成功');
        yield put({
          type: 'updateState',
          payload: {
            pwdVisble: false,
          },
        });
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
    *queryAllSupplier(_, { call, put }) {
      const response = yield call(queryAllSupplier);
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            allSupplierList: response.data,
          },
        });
      }
    },

    *queryAllHospital(_, { call, put }) {
      const response = yield call(queryAllHospital);
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            allHospitalList: response.data || 0,
          },
        });
      }
    },
    *getAvailableHospital({ payload }, { call, put }) {
      const response = yield call(AvailableHospital, payload);
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            availableHospital: response.data,
          },
        });
      }
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updateSalesman(state, { payload }) {
      return { ...state, salesman: payload.salesman };
    },
    updateRole(state, { payload }) {
      return { ...state, role: payload.role };
    },
    updateMethod(state, { payload }) {
      return { ...state, method: payload.method };
    },
    updateClassify(state, { payload }) {
      return { ...state, classify: payload.classify };
    },
    updateHospital(state, { payload }) {
      return { ...state, hospital: payload.hospital };
    },
    updateDepartment(state, { payload }) {
      return { ...state, department: payload.department };
    },
    updateSupplier(state, { payload }) {
      return { ...state, supplier: payload.supplier };
    },
    updateCount(state, { payload }) {
      return { ...state, orderCount: payload.orderCount };
    },
    updateDept(state, { payload }) {
      return { ...state, dept: payload.dept };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
        if (pathname !== '/user/login' && localStorage.getItem('deptType') === '4') {
          dispatch({
            type: 'queryCount',
          });
        }
        if (pathname !== '/user/login' && localStorage.getItem('deptType') === '2') {
          dispatch({
            type: 'querySupplierCount',
          });
        }
      });
    },
  },
};
