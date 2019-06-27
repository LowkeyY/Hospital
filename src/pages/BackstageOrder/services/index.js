import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  const { nowPage = 1, pageSize = 10, hospitalId } = params;
  return request(
    `/api/purchase//hospitalGetPurchaseListById?nowPage=${nowPage}&pageSize=${pageSize}&hospitalId=${hospitalId}`
  );
}

export async function queryDetails(params) {
  return request(`/api/purchase/getPurchaseDetails?${stringify(params)}`);
}
export async function recall(params) {
  return request(`/api/purchase/backPurchase?${stringify(params)}`);
}
