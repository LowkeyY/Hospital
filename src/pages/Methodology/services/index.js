import request from '@/utils/request';

export async function query() {
  return request('/api/method/findMethodList');
}

export async function create(params) {
  return request('/api/method/addMethod', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function editor(params) {
  return request('/api/method/updateMethod', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function deleteMethod(params) {
  return request('/api/method/deleteMethod', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
