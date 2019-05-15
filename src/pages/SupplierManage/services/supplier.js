import { stringify } from 'qs';
import request from '@/utils/request';

export async function querySupplierList(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/suppiler/getSuppilerList?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function querySupplierItem(params) {
  return request(`/api/suppiler/getSuppiler?${stringify(params)}`);
}

export async function create(params) {
  return request('/api/suppiler/addSuppiler', {
    method: 'POST',
    body: params,
  });
}

export async function editor(params) {
  return request('/api/suppiler/updateSuppiler', {
    method: 'POST',
    body: params,
  });
}

export async function enable(params) {
  return request('/api/suppiler/unlockSuppiler', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function block(params) {
  return request('/api/suppiler/lockSuppiler', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
