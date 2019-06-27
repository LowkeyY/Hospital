import request from '@/utils/request';

export async function query() {
  return request('/api/config/getSystemconfig');
}

export async function editor(params) {
  return request('/api/config/updateSystemconfig', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
