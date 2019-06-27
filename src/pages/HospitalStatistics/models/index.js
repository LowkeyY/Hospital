import { message } from 'antd';
import * as Service from '../services/index';

const filterAmountDate = data => {
  return data.map(item => {
    return {
      dept: item.dept,
      金额: item.price,
    };
  });
};
const filterTowYearDate = datass => {
  const lastYear = { name: '去年' };
  const nowYear = { name: '今年' };
  datass.map(item => {
    lastYear[item.deptName] = item.lastYear;
    nowYear[item.deptName] = item.nowYear;
  });
  return [lastYear, nowYear];
};

const filterThreeYearDate = data => {
  const firstThreeYear = { name: '前年' };
  const lastYear = { name: '去年' };
  const nowYear = { name: '今年' };
  data.map(item => {
    firstThreeYear[item.deptName] = item.firstThreeYear;
    lastYear[item.deptName] = item.lastYear;
    nowYear[item.deptName] = item.nowYear;
  });
  return [firstThreeYear, lastYear, nowYear];
};

const getDepts = data => {
  const arr = [];
  data.map(item => arr.push(item.deptName));
  return arr;
};

const getAmountTotal = data => {
  let sum = 0;
  data.map(item => {
    sum += item.price || 0;
  });
  return sum;
};

const getTowYearTotal = data => {
  let sum = 0;
  data.map(item => {
    sum += item.lastYear + item.nowYear || 0;
  });
  return sum;
};

const getThreeYearTotal = data => {
  let sum = 0;
  data.map(item => {
    sum += item.lastYear + item.nowYear + item.firstThreeYear || 0;
  });
  return sum;
};

export default {
  namespace: 'hospitalStatistics',
  state: {
    amountData: [],
    towYearDate: [],
    threeYearDate: [],
    amountTotal: '',
    towYearTotal: '',
    threeYearTotal: '',
    depts: [],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *queryAmount({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryAmount, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            amountData: filterAmountDate(data),
            amountTotal: getAmountTotal(data),
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *queryTwoYear({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryTwoYear, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            towYearDate: filterTowYearDate(data),
            depts: getDepts(data),
            towYearTotal: getTowYearTotal(data),
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *queryThreeYear({ payload }, { call, put }) {
      const { data, success, msg } = yield call(Service.queryThreeYear, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            threeYearDate: filterThreeYearDate(data),
            depts: getDepts(data),
            threeYearTotal: getThreeYearTotal(data),
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
  },
};
