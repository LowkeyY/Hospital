import request from '@/utils/request';

export async function query() {
  return request('/api/dir/findDirList');
}

export async function create(params) {
  return request('/api/dir/addDirInfo', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function editor(params) {
  return request('/api/dir/updateDirInfo', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function deleteGoods(params) {
  return request('/api/dir/deleteDir', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
