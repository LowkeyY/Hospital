import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/goods/findUserSpGoodByPage?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function create(params) {
  return request('/api/goods/addGoods', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editor(params) {
  return request('/api/goods/updateGoods', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteGoods(params) {
  return request('/api/menu/deleteMenu', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function enable(params) {
  return request('/api/goods/unlockGoods ', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function block(params) {
  return request('/api/goods/lockGoods', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
