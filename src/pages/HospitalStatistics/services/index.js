import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryAmount(params) {
  return request(`/api/reported/purchaseAmount?${stringify(params)}`);
}

export async function queryTwoYear(params) {
  return request(`/api/reported/getTwoYearOverdue?${stringify(params)}`);
}

export async function queryThreeYear(params) {
  return request(`/api/reported/getThreeYearOverdue?${stringify(params)}`);
}
