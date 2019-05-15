import request from '@/utils/request';

export async function outInventory(params) {
  return request('/api/library/outInventory', {
    method: 'POST',
    body: params,
  });
}
