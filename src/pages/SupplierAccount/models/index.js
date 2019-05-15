import { message } from 'antd';
import * as Service from '../services/index';

const getPicUrl = arr => {
  const newArr = [];
  arr.map((item, i) =>
    newArr.push({
      uid: `-${i}`,
      status: 'done',
      url: item,
    })
  );
  return newArr;
};

export default {
  namespace: 'supplierAccount',
  state: {
    data: {},
    isEditor: false,
    defaultBusiness: [],
    defaultMedical: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/backstage/Supplier-Account') {
        }
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      const { data, success, msg } = yield call(Service.queryAccount);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            data,
            defaultBusiness:
              data.licensePhotoPath && data.licensePhotoPath !== ''
                ? getPicUrl(data.licensePhotoPath.split(','))
                : [],
            defaultMedical:
              data.licensePhotoPath && data.yiliaoPhotoPath !== ''
                ? getPicUrl(data.yiliaoPhotoPath.split(','))
                : [],
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    *editor({ payload: values }, { call, put }) {
      const data = yield call(Service.editor, values);
      if (data.success) {
        yield put({ type: 'fetch' });
        message.success('修改成功');
        yield put({
          type: 'updateState',
          payload: {
            isEditor: true,
          },
        });
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
  },
};
