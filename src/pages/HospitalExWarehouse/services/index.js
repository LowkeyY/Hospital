import { stringify } from 'qs';
import request from '@/utils/request';

export async function outInventory(params) {
  return request('/api/library/outInventory', {
    method: 'POST',
    body: params,
  });
}

export async function queryList(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/libraryLog/getOutLog?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function querySingleDetails(params) {
  return request(`/api/library/getDetailById?${stringify(params)}`);
}
