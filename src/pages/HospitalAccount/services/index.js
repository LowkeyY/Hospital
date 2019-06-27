import request from '@/utils/request';

export async function queryAccount() {
  return request('/api/hospital/getMyHospital');
}

export async function editor(params) {
  return request('/api/hospital/updateHospitalList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
