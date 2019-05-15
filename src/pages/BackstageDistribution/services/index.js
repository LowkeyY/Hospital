import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  const { nowPage = 1, pageSize = 10, suppilerId } = params;
  return request(
    `/api/distribute/findSuppilerDistribute?nowPage=${nowPage}&pageSize=${pageSize}&suppilerId=${suppilerId}`
  );
}

export async function queryDetails(params) {
  return request(`/api/distribute/findDistributeDetails?${stringify(params)}`);
}
