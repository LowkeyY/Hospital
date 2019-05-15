import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryHospital() {
  return request(`/api/suppilerApply/getAllApplyHospitalList`);
}

export async function addHospital(params) {
  // registCode
  return request(`/api/suppilerApply/applyHospital?${stringify(params)}`);
}

export async function addDepartment(params) {
  return request(`/api/suppilerApply/applyDept?${stringify(params)}`);
}

export async function queryOrder() {
  return request(`/api/purchase/suppilerGetPurchaseList`);
}
