import request from '@/utils/request';

export async function queryAccount() {
  return request('/api/suppiler/getMySuppiler');
}

export async function editor(params) {
  return request('/api/suppiler/updateSuppiler', {
    method: 'POST',
    body: params,
  });
}
