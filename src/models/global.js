import {
  querySalesman,
  queryMethod,
  queryClassify,
  queryRole,
  queryHospital,
  queryDepartment,
  querySupplier,
} from '@/services/api';

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
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    updateSalesman(state, { payload }) {
      return { ...state, salesman: payload.salesman };
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
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
