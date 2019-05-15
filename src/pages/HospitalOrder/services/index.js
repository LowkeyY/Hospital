import request from '@/utils/request';

export async function queryGoodsList(params) {
  const { nowPage = 1, pageSize = 10, suppilerId = '' } = params;
  return request(
    `/api/goods/findSpGoodByPage?nowPage=${nowPage}&pageSize=${pageSize}&suppilerId=${suppilerId}`
  );
}

export async function addOrder(params) {
  return request('/api/purchase/orderGoods', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryInventory(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/library/findLibraryDetails?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function queryOverdue(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/library/findWarningLibrary?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function queryEarlyWarning(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/library/getDeptLibrary?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function queryShortage(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/library/getDeptLibrary?nowPage=${nowPage}&pageSize=${pageSize}`);
}
