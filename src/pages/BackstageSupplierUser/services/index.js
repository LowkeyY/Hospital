import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  return request(`/api/user/getSuppilerUser?${stringify(params)}`);
}

export async function create(params) {
  return request('/api/user/addSuppilerUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editor(params) {
  return request('/api/user/updateUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteUser(params) {
  return request('/api/menu/deleteMenu', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function enableUser(params) {
  return request('/api/user/enableUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function blockUser(params) {
  return request('/api/user/blockUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
