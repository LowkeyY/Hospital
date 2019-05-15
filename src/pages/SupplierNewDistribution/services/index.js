import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryGoodsList(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/goods/findUserSpGoodByPage?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function queryHospital() {
  return request('/api/suppilerApply/getApplyPassHospitalList');
}

export async function queryDepartment(params) {
  return request(`/api/suppilerApply/findHospitalApplyPassDeptList?${stringify(params)}`);
}

export async function addDistribution(params) {
  return request('/api/distribute/distribute', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
