import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  return request(`/api/suppilerApply/getMySuppilerApply?${stringify(params)}`);
}

export async function pass(params) {
  return request('/api/suppilerApply/auditPass', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function fail(params) {
  return request('/api/suppilerApply/auditFailure', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function enable(params) {
  return request('/api/suppilerApply/unlock', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function block(params) {
  return request('/api/suppilerApply/lock', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryDetails(params) {
  return request(`/api/suppiler/getSuppiler?${stringify(params)}`);
}
