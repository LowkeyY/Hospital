import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryTree(params) {
  return request(`/api/dept/getHospitalDeptTreeById?${stringify(params)}`);
}

export async function queryTreeItem(params) {
  return request(`/api/dept/getDeptInfo?${stringify(params)}`);
}

export async function createTree(params) {
  return request('/api/dept/addDepartmentByHospitalId', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editorTree(params) {
  return request('/api/dept/updateDept', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteTree(params) {
  return request('/api/menu/deleteTree', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryList(params) {
  const { nowPage = 1, pageSize = 10, deptId = '' } = params;
  return request(
    `/api/user/getUserListByPage?nowPage=${nowPage}&pageSize=${pageSize}&deptId=${deptId}`
  );
}

export async function createUser(params) {
  return request('/api/user/addHospitalUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editorUser(params) {
  return request('/api/user/updateUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteUser(params) {
  return request('/api/role/deleteUser', {
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
