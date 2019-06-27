import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  return request(`/api/distribute/hospitalDistribute?${stringify(params)}`);
}

export async function queryDetails(params) {
  return request(`/api/distribute/findDistributeDetails?${stringify(params)}`);
}
