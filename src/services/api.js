import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function login(params) {
  return request('/api/login', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function logout(params) {
  return request('/api/logout', {
    method: 'POST',
  });
}

export async function queryMenus() {
  return request(`/api/menu/getMenuByRole`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function querySalesman() {
  return request(`/api/user/findSlsmUserList`);
}

export async function queryMethod() {
  return request('/api/method/findMethodList');
}

export async function queryClassify() {
  return request('/api/dir/findDirList');
}

export async function queryRole() {
  return request('/api/role/getRoleList');
}

export async function queryHospital() {
  return request('/api/suppilerApply/getApplyHospitalList');
}

export async function queryDepartment(params) {
  return request(`/api/dept/getHospitalDeptById?${stringify(params)}`);
}

export async function querySupplier(params) {
  return request(`/api/suppilerApply/getMySuppiler?${stringify(params)}`);
}

export async function AvailableHospital(params) {
  return request(`/api/dept/findHospitalApplyDeptList?${stringify(params)}`);
}

export async function alipay(params) {
  return request(`/api/zhifubao/payment?${stringify(params)}`);
}

export async function alipayResult(params) {
  return request(`/api/zhifubao/callback?${stringify(params)}`);
}

export async function queryCount() {
  return request(`/api/purchase/suppilerGetPurchaseCount`);
}

export async function querySupplierCount() {
  return request(`/api/suppilerApply/getMySuppilerApplyCount`);
}

export async function queryHospitalDept() {
  return request(`/api/dept/getHospitalDeptByUser`);
}

export async function editorPwd(params) {
  return request('/api/user/updateUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryAllSupplier() {
  return request(`/api/suppiler/getAllSuppiler`);
}

export async function queryAllHospital() {
  return request(`/api/hospital/getAllHospital`);
}
