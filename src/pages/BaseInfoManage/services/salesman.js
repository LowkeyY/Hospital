import { stringify } from 'qs';
import request from '@/utils/request';

export async function querySalesmanList(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/user/findSlsmUserListByPage?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function queryUserList(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/user/findAdminUserListByPage?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function create(params) {
  return request('/api/user/addSlsmUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function createUser(params) {
  return request('/api/user/addAdminUser', {
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

export async function deleteSalesman(params) {
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
