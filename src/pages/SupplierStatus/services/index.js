import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryHospital(params) {
  return request(`/api/suppilerApply/findMyApplyHospital?${stringify(params)}`);
}

export async function queryDepartment(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/suppilerApply/findMyApplyDept?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function queryPayMoney() {
  return request(`/api/config/getAnnualFee`);
}

export async function queryPayRecord(params) {
  return request(`/api/invest/investRevordByApply?${stringify(params)}`);
}

export async function payChick(params) {
  return request(`/api/zhifubao/callback?${stringify(params)}`);
}
