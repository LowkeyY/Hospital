export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      {
        component: '404',
      },
    ],
  },

  //后台管理
  {
    path: '/backstage',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/backstage/access',
        routes: [
          //权限管理
          { path: '/backstage/access', redirect: '/backstage/access/menu' },
          {
            path: '/backstage/access/menu',
            component: './AccessManage/MenuManage',
          },
          {
            path: '/backstage/access/role',
            name: 'role',
            component: './AccessManage/RoleManage',
          },
        ],
      },
      //基本信息维护
      {
        name: '基本信息维护',
        path: '/backstage/info-manage',
        routes: [
          { path: '/backstage/info-manage', redirect: '/backstage/info-manage/salesman' },
          {
            path: '/backstage/info-manage/salesman',
            component: './BaseInfoManage/SalesmanInfo',
          },
          {
            path: '/backstage/info-manage/user',
            component: './BaseInfoManage/UserInfo',
          },
        ],
      },
      //供应商管理
      {
        name: '供应商管理',
        path: '/backstage/supplier-manage',
        component: './SupplierManage/SupplierManage',
      },
      {
        name: '供应商用户管理',
        path: '/backstage/supplierManage-user',
        component: './BackstageSupplierUser/BackstageSupplierUser',
      },
      {
        name: '供应商配货单',
        path: '/backstage/distribution-list',
        component: './BackstageDistribution/BackstageDistribution',
      },
      //医院管理
      {
        name: '医院管理',
        path: '/backstage/hospital-manage',
        component: './HospitalManage/HospitalManage',
      },
      {
        name: '医院订货单',
        path: '/backstage/order-list',
        component: './BackstageOrder/BackstageOrder',
      },
      {
        name: '组织机构管理',
        path: '/backstage/hospital-organization',
        component: './HospitalOrganization/HospitalOrganization',
      },
      //财务管理
      {
        name: '财务管理',
        icon: 'check-circle-o',
        path: '/backstage/finance-manage',
        routes: [
          {
            path: '/backstage/finance-manage',
            redirect: '/backstage/finance-manage/supplier',
          },
          {
            path: '/backstage/finance-manage/supplier',
            name: '供应商账户',
            component: './FinanceManage/SupplierBill',
          },
          {
            path: '/backstage/finance-manage/salesman',
            name: '业务员提成',
            component: './FinanceManage/SalesmanBill',
          },
        ],
      },
      {
        name: '系统配置',
        path: '/backstage/systemConfig',
        component: './SystemConfig',
      },
      //客户端供应商
      {
        name: '货品分类管理',
        path: '/backstage/goods-manage',
        component: './GoodsManage/GoodsManage',
      },
      {
        name: '方法学',
        path: '/backstage/methodology-manage',
        component: './Methodology/Methodology',
      },
      {
        name: '人员管理',
        path: '/backstage/Supplier-User',
        component: './SupplierUser/SupplierUser',
      },
      {
        name: '医院订货单',
        path: '/backstage/Order-Form',
        component: './OrderForm/OrderForm',
        routes: [
          {
            path: '/backstage/Order-Form',
            redirect: '/backstage/Order-Form/order',
          },
          {
            path: '/backstage/Order-Form/order',
            name: '订货单',
            component: './OrderForm/Order',
          },
          {
            path: '/backstage/Order-Form/apply',
            name: '申请医院',
            component: './OrderForm/Apply',
          },
        ],
      },
      {
        name: '新建配货单',
        path: '/backstage/Add-supplier',
        component: './SupplierNewDistribution',
        routes: [
          {
            path: '/backstage/Add-supplier',
            redirect: '/backstage/Add-supplier/fill-form',
          },
          {
            path: '/backstage/Add-supplier/fill-form',
            name: 'goodsList',
            component: './SupplierNewDistribution/Step0',
          },
          {
            path: '/backstage/Add-supplier/goodsList',
            name: 'goodsList',
            component: './SupplierNewDistribution/Step1',
          },
          {
            path: '/backstage/Add-supplier/distribution',
            name: 'distribution',
            component: './SupplierNewDistribution/Step2',
          },
          {
            path: '/backstage/Add-supplier/result',
            name: 'result',
            component: './SupplierNewDistribution/Step3',
          },
        ],
      },
      {
        name: '配货',
        path: '/backstage/Supplier-distribution',
        component: './SupplierDistribution/SupplierDistribution',
      },
      {
        path: '/backstage/Supplier-order',
        name: '订货单记录',
        component: './SupplierOrder/SupplierOrder',
      },
      {
        path: '/backstage/Supplier-distribution-list',
        name: '配货单记录',
        component: './SupplierDistributionList/SupplierDistributionList',
      },
      {
        name: '货品管理',
        path: '/backstage/goods-board',
        component: './GoodsBoard/GoodsBoard',
      },
      {
        name: '我的账号',
        path: '/backstage/Supplier-Account',
        component: './SupplierAccount/SupplierAccount',
      },
      {
        name: '我的账户',
        path: '/backstage/Supplier-Status',
        routes: [
          { path: '/backstage/Supplier-Status', redirect: '/backstage/Supplier-Status/hospitals' },
          {
            path: '/backstage/Supplier-Status/hospitals',
            component: './SupplierStatus/Hospitals',
          },
          {
            path: '/backstage/Supplier-Status/departments',
            component: './SupplierStatus/Departments',
          },
        ],
      },
      {
        name: '供应商医院科室',
        path: '/backstage/Supplier-department',
        component: './SupplierDepartment/SupplierDepartment',
      },
      {
        name: '供应商医院科室货品',
        path: '/backstage/Supplier-goods',
        component: './SupplierGoods/SupplierGoods',
      },

      //医院
      {
        name: '订货',
        path: '/backstage/hospital-order',
        component: './HospitalOrder/HospitalOrder',
        routes: [
          {
            path: '/backstage/hospital-order',
            redirect: '/backstage/hospital-order/inventory',
          },
          {
            path: '/backstage/hospital-order/inventory',
            name: '库存清单',
            component: './HospitalOrder/Inventory',
          },
          {
            path: '/backstage/hospital-order/shortage',
            name: '缺货清单',
            component: './HospitalOrder/Shortage',
          },
          {
            path: '/backstage/hospital-order/early-warning',
            name: '有效期预警',
            component: './HospitalOrder/EarlyWarning',
          },
          {
            path: '/backstage/hospital-order/overdue',
            name: '过期清单',
            component: './HospitalOrder/Overdue',
          },
        ],
      },
      {
        name: '库存管理',
        path: '/backstage/hospital-dispose-manage',
        component: './HospitalOrder/HospitalOrder',
        routes: [
          {
            path: '/backstage/hospital-dispose-manage',
            redirect: '/backstage/hospital-dispose-manage/inventory',
          },
          {
            path: '/backstage/hospital-dispose-manage/inventory',
            name: '库存清单',
            component: './HospitalOrder/Inventory',
          },
          {
            path: '/backstage/hospital-dispose-manage/shortage',
            name: '缺货清单',
            component: './HospitalOrder/Shortage',
          },
          {
            path: '/backstage/hospital-dispose-manage/early-warning',
            name: '有效期预警',
            component: './HospitalOrder/EarlyWarning',
          },
          {
            path: '/backstage/hospital-dispose-manage/overdue',
            name: '过期清单',
            component: './HospitalOrder/Overdue',
          },
        ],
      },
      {
        name: '库存配置',
        path: '/backstage/hospital-dispose',
        component: './HospitalDisposeGoods/HospitalDisposeGoods',
      },
      {
        name: '订货单',
        path: '/backstage/hospital-ordering',
        component: './HospitalOrder/Ordering',
      },
      {
        name: '一键补货',
        path: '/backstage/hospital-quickordering',
        component: './HospitalOrder/QuickOrdering',
      },
      {
        name: '入库',
        path: '/backstage/hospital-warehouseing',
        routes: [
          {
            path: '/backstage/hospital-warehouseing',
            component: './HospitalWarehousing/Warehousing',
          },
          {
            path: '/backstage/hospital-warehouseing/record',
            name: '入库记录',
            component: './HospitalWarehousing/Record',
          },
        ],
      },
      {
        name: '出库',
        path: '/backstage/hospital-ex-warehouse',
        routes: [
          {
            path: '/backstage/hospital-ex-warehouse',
            component: './HospitalExWarehouse/ExWarehouse',
          },
          {
            path: '/backstage/hospital-ex-warehouse/record',
            name: '出库记录',
            component: './HospitalExWarehouse/Record',
          },
        ],
      },
      {
        name: '订货单查询',
        path: '/backstage/hospital-order-record',
        component: './HospitalOrderRecord/HospitalOrderRecord',
      },
      {
        name: '配货单查询',
        path: '/backstage/hospital-distribution-list',
        component: './HospitalDistributionList/HospitalDistributionList',
      },
      {
        name: '组织机构管理',
        path: '/backstage/organization-manage',
        component: './Organization/Organization',
      },
      {
        name: '申请记录',
        path: '/backstage/hospital-apply',
        component: './HospitalApply/HospitalApply',
      },
      {
        name: '我的医院',
        path: '/backstage/Hospital-Account',
        component: './HospitalAccount/HospitalAccount',
      },
      {
        name: '报表统计',
        path: '/backstage/Hospital-statistic',
        routes: [
          {
            path: '/backstage/Hospital-statistic',
            redirect: '/backstage/Hospital-statistic/amount',
          },
          {
            path: '/backstage/Hospital-statistic/amount',
            component: './HospitalStatistics/amount',
          },
          {
            path: '/backstage/Hospital-statistic/loss',
            component: './HospitalStatistics/loss',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/backstage/result',
        component: './Result',
        routes: [
          // result
          {
            path: '/backstage/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/backstage/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },

  //index
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      { path: '/', redirect: '/desktop' },
      { path: '/desktop', name: 'desktop', component: './Desktop/Desktop' },
      {
        component: '404',
      },
    ],
  },
];
