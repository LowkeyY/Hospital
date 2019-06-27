import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Pagination } from 'antd';
import { routerRedux } from 'dva/router';
import SearchForm from './components/SearchForm';
import styles from './HospitalOrder.less';

@connect(({ loading, hospitalOrder }) => ({
  hospitalOrder,
  loading: loading.effects['hospitalOrder/fetchInventory'],
}))
class Inventory extends PureComponent {
  componentDidMount() {
    const deptType = localStorage.getItem('deptType');
    const {
      dispatch,
      hospitalOrder: { pageSize, deptId, hasButton },
    } = this.props;
    if (!hasButton) {
      dispatch(routerRedux.replace('/backstage/hospital-order/Shortage'));
    }
    if (deptType !== '2' || deptId !== '') {
      dispatch({
        type: 'hospitalOrder/fetchInventory',
        payload: {
          nowPage: 1,
          pageSize,
          deptId,
        },
      });
    }
  }

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitalOrder: { pageSize, deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'hospitalOrder/fetchInventory',
      payload: {
        nowPage: page,
        pageSize,
        deptId,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/updatePageSize',
      payload: {
        pageSize,
      },
    });
    dispatch({
      type: 'hospitalOrder/fetchInventory',
      payload: {
        nowPage: current,
        pageSize,
        deptId,
      },
    });
  };

  handlerSubmit = (record, values) => {
    const {
      dispatch,
      hospitalOrder: { infos },
    } = this.props;
    if (infos === {}) {
      dispatch({
        type: 'hospitalOrder/addGoodsConfig',
        payload: {
          ...values,
          goodsId: record.goodsId,
          suppilerId: record.suppilerBase.suppilerId,
        },
      });
    } else {
      dispatch({
        type: 'hospitalOrder/updateCongif',
        payload: {
          ...values,
          goodsId: record.goodsId,
          configId: infos.configId,
          suppilerId: record.suppilerBase.suppilerId,
        },
      });
    }
  };

  handlerGetInfoClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrder/queryInfos',
    });
  };

  hanlerReset = () => {
    const {
      dispatch,
      hospitalOrder: { pageSize, deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/fetchInventory',
      payload: {
        nowPage: 1,
        pageSize,
        deptId,
      },
    });
  };

  handlerSearch = values => {
    const {
      dispatch,
      hospitalOrder: { pageSize, deptId },
    } = this.props;
    const { goodsName = '', suppilerId = '' } = values;
    const res = {
      goodsName: goodsName === '' ? undefined : goodsName,
      suppilerId: suppilerId === '' ? undefined : suppilerId,
      nowPage: 1,
      pageSize,
      deptId,
    };
    dispatch({
      type: 'hospitalOrder/fetchInventory',
      payload: {
        ...res,
      },
    });
  };

  render() {
    const {
      hospitalOrder: { inventoryList, totalCount, nowPage, pageSize, infos },
      loading,
    } = this.props;
    const columns = [
      {
        title: '货品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 200,
        fixed: 'left',
        render: (text, record) => record.goodsBase.goodsNameCn,
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
        render: (text, record) => record.goodsBase.goodsSpec,
      },
      {
        title: '方法学',
        dataIndex: 'methodName',
        key: 'methodName',
        render: (text, record) => record.goodsBase.methodBase.methodName,
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
        render: (text, record) => record.goodsBase.goodsUnit,
      },
      {
        title: '使用数量',
        dataIndex: 'usageNumber',
        key: 'usageNumber',
      },
      {
        title: '剩余数量',
        dataIndex: 'surplusNumber',
        key: 'surplusNumber',
      },
      {
        title: '批号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
      },
      {
        title: '有效期',
        dataIndex: 'termOfValidity',
        key: 'termOfValidity',
      },
      {
        title: '产地',
        dataIndex: 'isImportef',
        key: 'isImportef',
        render: (text, record) => (record.isImportef === '0' ? '进口' : '国产'),
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        render: (text, record) => record.goodsBase.manufacturer,
      },
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        render: (text, record) => record.suppilerBase.suppilerName,
      },
      // {
      //   title: '操作',
      //   key: 'order',
      //   render: (text, record) => (
      //     <Modal record={record} infos={infos} onOk={values => this.handlerSubmit(record, values)}>
      //       <Button size="small" onClick={() => this.handlerGetInfoClick()}>
      //         库存配置
      //       </Button>
      //     </Modal>
      //   ),
      // },
    ];
    return (
      <div className={styles.commonList}>
        <div className={styles.tableForm}>
          <SearchForm onOk={this.handlerSearch} onReset={this.hanlerReset} />
        </div>
        <Table
          columns={columns}
          dataSource={inventoryList}
          rowKey={record => record.goodsId}
          loading={loading}
          pagination={false}
          onChange={this.pageChangeHandler}
          scroll={{ x: 1300 }}
        />
        <Pagination
          className="ant-table-pagination"
          total={totalCount * 1}
          current={nowPage * 1}
          pageSize={pageSize * 1}
          onChange={this.pageChangeHandler}
          showSizeChanger
          onShowSizeChange={this.onShowSizeChange}
        />
      </div>
    );
  }
}

export default Inventory;
