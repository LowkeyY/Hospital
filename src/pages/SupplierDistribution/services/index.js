import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  return request(`/api/purchase/getPurchaseDetails?${stringify(params)}`);
}

export async function addDistribution(params) {
  return request('/api/distribute/distribute', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
