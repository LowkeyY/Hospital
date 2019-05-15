import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/distribute/suppilerDistribute?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function queryDetails(params) {
  return request(`/api/distribute/findDistributeDetails?${stringify(params)}`);
}
