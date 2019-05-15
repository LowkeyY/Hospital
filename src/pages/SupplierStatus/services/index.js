import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryHospital(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/suppilerApply/findMyApplyHospital?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function queryDepartment(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/suppilerApply/findMyApplyDept?nowPage=${nowPage}&pageSize=${pageSize}`);
}
