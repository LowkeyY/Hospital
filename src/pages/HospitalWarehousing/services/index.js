import request from '@/utils/request';

export async function addInventory(params) {
  return request('/api/library/addInventory', {
    method: 'POST',
    body: params,
  });
}
