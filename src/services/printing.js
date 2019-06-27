import { stringify } from 'qs';
import request from '@/utils/request';

export async function querySupplierBase(params) {
  return request(`/api/distribute/getPrintBase?${stringify(params)}`);
}

export async function querySupplierDetails(params) {
  return request(`/api/distribute/getPrintDetails?${stringify(params)}`);
}
