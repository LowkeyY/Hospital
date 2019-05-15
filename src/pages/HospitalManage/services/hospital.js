import request from '@/utils/request';

export async function queryHospitalList(params) {
  const { nowPage = 1, pageSize = 10 } = params;
  return request(`/api/hospital/getHospitalList?nowPage=${nowPage}&pageSize=${pageSize}`);
}

export async function create(params) {
  return request('/api/hospital/addHospital', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editor(params) {
  return request('/api/hospital/updateHospitalList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteHospital(params) {
  return request('/api/menu/deleteMenu', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function enable(params) {
  return request('/api/hospital/unlockHospitalList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function block(params) {
  return request('/api/hospital/lockHospitalList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
