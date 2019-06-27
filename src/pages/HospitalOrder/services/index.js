import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryGoodsList(params) {
  const { nowPage = 1, pageSize = 10, suppilerId = '', deptId = '' } = params;
  return request(
    `/api/goods/findSpGoodByPage?nowPage=${nowPage}&pageSize=${pageSize}&suppilerId=${suppilerId}&deptId=${deptId}`
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
  return request(`/api/library/findLibraryDetails?${stringify(params)}`);
}

export async function queryOverdue(params) {
  return request(`/api/library/findBeOverdueLibrary?${stringify(params)}`);
}

export async function queryEarlyWarning(params) {
  return request(`/api/library/findWarningLibrary?${stringify(params)}`);
}

export async function queryShortage(params) {
  return request(`/api/library/findShortageLibrary?${stringify(params)}`);
}

export async function queryInfos(params) {
  return request(`/api/libraryconfig/getGoodsConfig?${stringify(params)}`);
}

export async function addGoodsConfig(params) {
  return request(`/api/libraryconfig/addGoodsConfig`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateCongif(params) {
  return request(`/api/libraryconfig/updateCongif`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryQuickList(params) {
  return request(`/api/purchase/getReplenishList?${stringify(params)}`);
}

export async function report(params) {
  return request('/api/library/lossGoods', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryCount(params) {
  return request(`/api/library/findShortageCount?${stringify(params)}`);
}
