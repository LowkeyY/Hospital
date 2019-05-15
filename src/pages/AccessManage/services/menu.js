import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryMenuList() {
  return request('/api/menu/getMenuTree');
}

export async function queryMenuItem(params) {
  return request(`/api/menu/getMenuById?${stringify(params)}`);
}

export async function create(params) {
  return request('/api/menu/addMenu', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editor(params) {
  return request('/api/menu/updateMenu', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteMenu(params) {
  return request('/api/menu/deleteMenu', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryRoleList() {
  return request('/api/role/getRoleList');
}

export async function createRole(params) {
  return request('/api/role/addRole', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function editorRole(params) {
  return request('/api/role/updateRole', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function deleteRole(params) {
  return request('/api/role/deleteRole', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
