import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryDisposeList(params) {
  return request(`/api/libraryconfig/getDeptAllGoods?${stringify(params)}`);
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

export async function quickCongif(params) {
  return request(`/api/libraryconfig//quickSetup`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
