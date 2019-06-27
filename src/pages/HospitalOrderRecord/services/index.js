import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  return request(`/api/purchase/hospitalGetPurchaseList?${stringify(params)}`);
}

export async function queryDetails(params) {
  return request(`/api/purchase/getPurchaseDetails?${stringify(params)}`);
}

export async function recall(params) {
  return request(`/api/purchase/backPurchase?${stringify(params)}`);
}
