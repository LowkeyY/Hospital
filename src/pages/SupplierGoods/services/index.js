import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  const { nowPage = 1, pageSize = 10, deptId = '' } = params;
  return request(`/api/dgc/findGoodsList?nowPage=${nowPage}&pageSize=${pageSize}&deptId=${deptId}`);
}

export async function queryGoodsList(params) {
  return request(`/api/goods/findSpGoodByDept?${stringify(params)}`);
}

export async function editor(params) {
  return request('/api/dgc/upUnit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addGoods(params) {
  return request('/api/dgc/addDeptGoods', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function enable(params) {
  return request('/api/dgc/unlockCongif', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function block(params) {
  return request('/api/dgc/lockCongif', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
