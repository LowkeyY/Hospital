import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  return request(`/api/suppilerApply/findAllApplyHospital?${stringify(params)}`);
}

export async function recharge(params) {
  return request('/api/invest/backInvest', {
    method: 'POST',
    body: params,
  });
}

export async function queryPayRecord(params) {
  return request(`/api/invest/investRevordByApply?${stringify(params)}`);
}

export async function queryRecharge(params) {
  return request(`/api/deduct/getList?${stringify(params)}`);
}

export async function doRecharge(params) {
  return request(`/api/deduct/deduct?${stringify(params)}`);
}
