import { stringify } from 'qs';
import request from '@/utils/request';

export async function addInventory(params) {
  return request('/api/library/addInventory', {
    method: 'POST',
    body: params,
  });
}

export async function queryList(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/libraryLog/getAddLog?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function queryDetails(params) {
  return request(`/api/distribute/findDistributeDetails?${stringify(params)}`);
}

export async function querySingleDetails(params) {
  return request(`/api/library/getDetailById?${stringify(params)}`);
}
